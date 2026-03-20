"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPersonaVerification } from "@/services";
import { useToast } from "./useToast";
import { getErrorMessage } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile, selectProfile } from "@/store/slice";

interface StartVerificationOptions {
    templateId?: string;
    referenceId?: string;
    redirectUri?: string;
}

type PersonaFlowStatus = "created" | "cancelled" | "completed";

interface PersonaSessionState {
    inquiryId: string;
    clientToken: string;
    status: PersonaFlowStatus;
    updatedAt: string;
}

export function usePersonaVerification() {

    const { showError, showSuccess } = useToast();
    const dispatch = useAppDispatch();
    const profile = useAppSelector(selectProfile);
    const [isVerifying, setIsVerifying] = useState(false);
    const hasPreloadedRef = useRef(false);

    const getSession = useCallback(
        async (options: StartVerificationOptions = {}, silent = false): Promise<PersonaSessionState | null> => {
            if (typeof window === "undefined") return null;

            const userId = profile?.user?.user_id || "current_user";
            const template_id =
                options.templateId || process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID || "";
            const reference_id = options.referenceId || `user_${userId}`;
            const redirect_uri = options.redirectUri || `${window.location.origin}/persona/callback`;
            const storageKey = `persona_verification_${userId}`;

            if (!template_id) {
                if (!silent) showError("Persona template ID is not configured.");
                return null;
            }

            if (profile?.user?.persona_verified) {
                return null;
            }

            let session: PersonaSessionState | null = null;
            const storedSessionRaw = window.sessionStorage.getItem(storageKey);

            if (storedSessionRaw) {
                try {
                    const parsed = JSON.parse(storedSessionRaw) as PersonaSessionState;
                    if (parsed?.clientToken && parsed?.status === "created") {
                        session = parsed;
                    } else {
                        // If user cancelled/completed, don't reuse the old inquiry.
                        window.sessionStorage.removeItem(storageKey);
                    }
                } catch {
                    window.sessionStorage.removeItem(storageKey);
                }
            }

            if (!session) {
                const response = await createPersonaVerification({
                    template_id,
                    reference_id,
                    redirect_uri,
                });

                const inquiryId = response?.data?.inquiry_id;
                const clientToken = response?.data?.client_token;

                if (!inquiryId || !clientToken) {
                    if (!silent) showError("Failed to start Persona verification.");
                    return null;
                }

                session = {
                    inquiryId,
                    clientToken,
                    status: "created",
                    updatedAt: new Date().toISOString(),
                };
                window.sessionStorage.setItem(storageKey, JSON.stringify(session));
            }

            return session;
        },
        [profile?.user?.persona_verified, profile?.user?.user_id, showError]
    );

    useEffect(() => {
        // Pre-create Persona session once after profile arrives, so button click is instant.
        if (hasPreloadedRef.current) return;
        if (!profile?.user) return;
        if (profile.user.persona_verified) return;
        if (typeof window === "undefined") return;

        const userId = profile.user.user_id;
        const storageKey = `persona_verification_${userId}`;

        try {
            const raw = window.sessionStorage.getItem(storageKey);
            if (raw) {
                const parsed = JSON.parse(raw) as PersonaSessionState;
                // Only preload when we have an in-progress/ready session.
                if (parsed?.status === "created") {
                    hasPreloadedRef.current = true;
                    void getSession({}, true);
                } else {
                    // cancelled/completed -> don't auto-open again
                    hasPreloadedRef.current = true;
                }
            } else {
                hasPreloadedRef.current = true;
                void getSession({}, true);
            }
        } catch {
            hasPreloadedRef.current = true;
            void getSession({}, true);
        }
    }, [getSession, profile?.user]);

    const startVerification = useCallback(
        async (options: StartVerificationOptions = {}) => {

            if (isVerifying) return;

            try {

                if (typeof window === "undefined") {
                    return;
                }

                setIsVerifying(true);

                const userId = profile?.user?.user_id;

                if (!userId) {
                    showError("User ID is not configured.");
                    return;
                }

                const template_id =
                    options.templateId || process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID || "";
                const reference_id = options.referenceId || `user_${userId}`;
                const storageKey = `persona_verification_${userId}`;

                if (!template_id) {
                    showError("Persona template ID is not configured.");
                    return;
                }

                if (profile?.user?.persona_verified) {
                    showSuccess("You are already verified.");
                    return;
                }

                // Dynamically load Persona only on the client to avoid SSR errors
                const PersonaModule = await import("persona");
                const Persona = (PersonaModule as any).default ?? (PersonaModule as any);
                const session = await getSession(options);
                if (!session) return;

                const client = new Persona.Client({
                    clientToken: session.clientToken,
                    templateId: template_id,
                    referenceId: reference_id,
                    environmentId: process.env.NEXT_PUBLIC_PERSONA_ENV_ID,
                    onReady: () => client.open(),
                    onComplete: () => {
                        const completedSession: PersonaSessionState = {
                            ...session,
                            status: "completed",
                            updatedAt: new Date().toISOString(),
                        };
                        window.sessionStorage.setItem(storageKey, JSON.stringify(completedSession));
                        void dispatch(fetchProfile());
                        showSuccess("Verification completed.");
                    },
                    onCancel: () => {
                        const cancelledSession: PersonaSessionState = {
                            ...session,
                            status: "cancelled",
                            updatedAt: new Date().toISOString(),
                        };
                        window.sessionStorage.setItem(storageKey, JSON.stringify(cancelledSession));
                        showError("Verification cancelled.");
                    },
                    onError: (error: unknown) => {
                        const msg = getErrorMessage(error);
                        showError(msg || "Persona verification failed.");
                    },
                });
            } catch (error) {
                const msg = getErrorMessage(error);
                showError(msg || "Failed to start Persona verification.");
            } finally {
                setIsVerifying(false);
            }
        },
        [dispatch, getSession, isVerifying, profile?.user?.persona_verified, profile?.user?.user_id, showError, showSuccess]
    );

    return {
        startVerification,
        isVerifying,
    };
}

