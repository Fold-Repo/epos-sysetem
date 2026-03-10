"use client";

import { useCallback, useState } from "react";
import { createPersonaVerification } from "@/services";
import { useToast } from "./useToast";
import { getErrorMessage } from "@/utils";

interface StartVerificationOptions {
    templateId?: string;
    referenceId?: string;
    redirectUri?: string;
}

export function usePersonaVerification() {

    const { showError, showSuccess } = useToast();
    const [isVerifying, setIsVerifying] = useState(false);

    const startVerification = useCallback(
        async (options: StartVerificationOptions = {}) => {

            if (isVerifying) return;

            try {

                if (typeof window === "undefined") {
                    return;
                }

                setIsVerifying(true);

                const template_id =
                    options.templateId || process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID || "";
                const reference_id = options.referenceId || "current_user";
                const redirect_uri = options.redirectUri || `${window.location.origin}/persona/callback`;

                if (!template_id) {
                    showError("Persona template ID is not configured.");
                    return;
                }

                // Dynamically load Persona only on the client to avoid SSR errors
                const PersonaModule = await import("persona");
                const Persona = (PersonaModule as any).default ?? (PersonaModule as any);
                
                const response = await createPersonaVerification({
                    template_id,
                    reference_id,
                    redirect_uri,
                });

                const client = new Persona.Client({
                    clientToken: response?.data?.client_token,
                    templateId: template_id,
                    referenceId: reference_id,
                    environmentId: process.env.NEXT_PUBLIC_PERSONA_ENV_ID,
                    onReady: () => client.open(),
                    onComplete: () => {
                        showSuccess("Verification completed.");
                    },
                    onCancel: () => {
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
        [isVerifying, showError, showSuccess]
    );

    return {
        startVerification,
        isVerifying,
    };
}

