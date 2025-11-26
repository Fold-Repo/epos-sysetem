"use client";

import { useCallback } from "react";
import { addToast } from "@heroui/react";

export const useToast = () => {
    
    const showToast = useCallback((message: string, color: 'success' | 'danger' | 'warning' | 'primary' = 'primary', description?: string) => {
        addToast({
            title: message,
            description,
            color,
            variant: "flat",
            timeout: 6000,
            radius: "lg"
        });
    }, []);

    const showSuccess = useCallback((message: string, description?: string) => {
        showToast(message, 'success', description);
    }, [showToast]);

    const showError = useCallback((message: string, description?: string) => {
        showToast(message, 'danger', description);
    }, [showToast]);

    const showWarning = useCallback((message: string, description?: string) => {
        showToast(message, 'warning', description);
    }, [showToast]);

    const showInfo = useCallback((message: string, description?: string) => {
        showToast(message, 'primary', description);
    }, [showToast]);

    return {
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };
};
