"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePersonaVerificationImpl } from "./usePersonaVerification";

type PersonaVerificationValue = ReturnType<typeof usePersonaVerificationImpl>;

const PersonaVerificationContext = createContext<PersonaVerificationValue | null>(null);

export function PersonaVerificationProvider({ children }: { children: ReactNode }) {
    const value = usePersonaVerificationImpl();
    return (
        <PersonaVerificationContext.Provider value={value}>
            {children}
        </PersonaVerificationContext.Provider>
    );
}

export function usePersonaVerification() {
    const ctx = useContext(PersonaVerificationContext);
    if (!ctx) {
        throw new Error("usePersonaVerification must be used within PersonaVerificationProvider");
    }
    return ctx;
}
