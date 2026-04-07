"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPersonaVerification } from "@/services";
import { useToast } from "./useToast";
import { getErrorMessage } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProfile, selectProfile } from "@/store/slice";

declare global {
    interface Window {
        Persona?: any;
    }
}

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

export function usePersonaVerificationImpl() {

    const { showError, showSuccess } = useToast();
    const dispatch = useAppDispatch();
    const profile = useAppSelector(selectProfile);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isPersonaSuccessModalOpen, setIsPersonaSuccessModalOpen] = useState(false);
    const hasPreloadedRef = useRef(false);
    const hasHandledPersonaCompletedRef = useRef(false);

    const loadPersonaSdk = useCallback(async (url: string) => {
        if (typeof window === "undefined") return;

        // ======================================================
        // CHECK IF PERSONA SDK IS ALREADY LOADED
        // ======================================================
        if (window.Persona?.Client) return;

        const existing = document.getElementById("persona-sdk");
        if (existing && (existing as HTMLScriptElement).src === url) return;
        if (existing) existing.remove();

        await new Promise<void>((resolve, reject) => {
            const s = document.createElement("script");
            s.id = "persona-sdk";
            s.src = url;
            s.crossOrigin = "anonymous";
            s.onload = () => resolve();
            s.onerror = () => reject(new Error(`Failed to load Persona SDK from ${url}`));
            document.head.appendChild(s);
        });
    }, []);

    const closePersonaSuccessModal = useCallback(() => {
        setIsPersonaSuccessModalOpen(false);
    }, []);

    const getSession = useCallback(
        async (options: StartVerificationOptions = {}, silent = false): Promise<PersonaSessionState | null> => {
            if (typeof window === "undefined") return null;

            const userId = profile?.user?.user_id || "current_user";
            const template_id =
                options.templateId || process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID || "";
            const reference_id = options.referenceId || `user_${userId}`;
            // ======================================================
            // GET APP BASE URL
            // ======================================================
            const appBaseUrl = window.location.origin;

            // ======================================================
            // CREATE REDIRECT URI
            // ======================================================
            const redirect_uri =
                options.redirectUri || `${appBaseUrl}/dashboard${window.location.search}`;

            // ======================================================
            // CREATE STORAGE KEY
            // ======================================================
            const storageKey = `persona_verification_${userId}_${encodeURIComponent(appBaseUrl)}`;

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

        const appBaseUrl = window.location.origin;
        const userId = profile.user.user_id;
        const storageKey = `persona_verification_${userId}_${encodeURIComponent(appBaseUrl)}`;

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

    // If Persona redirected back with `status=completed`, open the success modal after reload.
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (hasHandledPersonaCompletedRef.current) return;

        const params = new URLSearchParams(window.location.search);
        const status = params.get("status");
        if (status !== "completed") return;

        // Prefer redux user_id, but fall back to Persona callback query params
        // so we can update sessionStorage even before profile refresh completes.
        const userId =
            profile?.user?.user_id ||
            (() => {
                const raw = params.get("subject") || params.get("reference-id");
                if (!raw) return null;
                // Persona reference_id is `user_${userId}` in our createSession logic.
                if (raw.startsWith("user_")) return raw.slice("user_".length);
                return raw;
            })() ||
            "current_user";

        const appBaseUrl = window.location.origin;
        const storageKey = `persona_verification_${userId}_${encodeURIComponent(appBaseUrl)}`;

        // If we previously preloaded an inquiry (status "created"), update it to "completed"
        // so the dashboard layout doesn't try to open Persona again.
        try {
            const raw = window.sessionStorage.getItem(storageKey);
            const nextUpdatedAt = new Date().toISOString();
            if (raw) {
                const parsed = JSON.parse(raw) as Partial<PersonaSessionState>;
                parsed.status = "completed";
                parsed.updatedAt = nextUpdatedAt;
                window.sessionStorage.setItem(storageKey, JSON.stringify(parsed));
            } else {
                // Layout auto-open only checks `status`, so we can write a minimal object.
                window.sessionStorage.setItem(storageKey, JSON.stringify({ status: "completed", updatedAt: nextUpdatedAt }));
            }
        } catch {
            // ignore storage issues
        }

        setIsPersonaSuccessModalOpen(true);
        hasHandledPersonaCompletedRef.current = true;

        // Refresh profile so `personaVerified` becomes true quickly.
        void (async () => {
            try {
                await dispatch(fetchProfile()).unwrap();
            } catch {
                // ignore
            }
        })();

        // Strip Persona callback params so the user lands on a clean dashboard URL
        // (keeping your existing dashboard query params like `?iik=...`).
        try {
            const next = new URL(window.location.href);
            // Persona-only callback params
            next.searchParams.delete("personaReturnUrl");
            next.searchParams.delete("inquiry-id");
            next.searchParams.delete("reference-id");
            next.searchParams.delete("subject");
            // This `status` is Persona's status, not your app's; remove it.
            if (next.searchParams.get("status") === "completed") {
                // Keep the key with an empty value to match the requested clean URL shape.
                next.searchParams.set("status", "");
            } else {
                next.searchParams.delete("status");
            }
            window.history.replaceState({}, "", next.pathname + next.search + next.hash);
        } catch {
            // ignore
        }
    }, [dispatch, profile?.user?.user_id]);

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
                const appBaseUrl = window.location.origin;
                const storageKey = `persona_verification_${userId}_${encodeURIComponent(appBaseUrl)}`;

                if (!template_id) {
                    showError("Persona template ID is not configured.");
                    return;
                }

                if (profile?.user?.persona_verified) {
                    showSuccess("You are already verified.");
                    return;
                }

                // Load Persona SDK from CDN (no bundler dependency needed).
                const sdkUrl =
                    process.env.NEXT_PUBLIC_PERSONA_SDK_URL ||
                    "https://cdn.withpersona.com/dist/persona-v5.7.0.js";
                await loadPersonaSdk(sdkUrl);

                const Persona = window.Persona;
                if (!Persona?.Client) {
                    showError("Persona SDK did not expose Persona.Client. Check the SDK URL.");
                    return;
                }
                const session = await getSession(options);
                if (!session) return;

                // Persona embedded flow using a server-created inquiry:
                // - inquiryId + sessionToken (your backend's client_token)
                // - environmentId
                let client: any;
                client = new Persona.Client({
                    inquiryId: session.inquiryId,
                    sessionToken: session.clientToken,
                    environmentId: process.env.NEXT_PUBLIC_PERSONA_ENV_ID,
                    onReady: () => client.open(),
                    onComplete: () => {
                        const completedSession: PersonaSessionState = {
                            ...session,
                            status: "completed",
                            updatedAt: new Date().toISOString(),
                        };
                        window.sessionStorage.setItem(storageKey, JSON.stringify(completedSession));
                        void (async () => {
                            try {
                                await dispatch(fetchProfile()).unwrap();
                            } catch {
                            }
                            setIsPersonaSuccessModalOpen(true);
                        })();
                        try {
                            client.destroy?.();
                        } catch {
                            // ignore
                        }
                    },
                    onCancel: () => {
                        const cancelledSession: PersonaSessionState = {
                            ...session,
                            status: "cancelled",
                            updatedAt: new Date().toISOString(),
                        };
                        window.sessionStorage.setItem(storageKey, JSON.stringify(cancelledSession));
                        showError("Verification cancelled.");
                        try {
                            client.destroy?.();
                        } catch {
                            // ignore
                        }
                    },
                    onError: (error: unknown) => {
                        const msg = getErrorMessage(error);
                        showError(msg || "Persona verification failed.");
                        try {
                            client.destroy?.();
                        } catch {
                            // ignore
                        }
                    },
                });
            } catch (error) {
                const msg = getErrorMessage(error);
                showError(msg || "Failed to start Persona verification.");
            } finally {
                setIsVerifying(false);
            }
        },
        [
            dispatch,
            getSession,
            isVerifying,
            loadPersonaSdk,
            profile?.user?.persona_verified,
            profile?.user?.user_id,
            showError,
            showSuccess,
        ]
    );

    return {
        startVerification,
        isVerifying,
        isPersonaSuccessModalOpen,
        closePersonaSuccessModal,
    };
}

