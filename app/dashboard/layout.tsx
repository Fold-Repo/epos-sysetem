'use client'

import { NavBar, SideBar } from '@/components'
import React, { useState } from 'react'
import { DASHBOARD_ROOT, DASHBOARD_SECTIONS } from '@/constants'
import { usePermissions, useFetchAllData, usePersonaVerification } from '@/hooks'
import { useAppSelector } from '@/store/hooks'
import { selectProfile } from '@/store/slice'
import { useEffect, useRef } from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

    const [open, setOpen] = useState<boolean>(false)
    const { permissions } = usePermissions()
    const profile = useAppSelector(selectProfile)
    const personaVerified = profile?.user?.persona_verified
    const userId = profile?.user?.user_id
    const { startVerification } = usePersonaVerification()

    const hasAutoStartedRef = useRef(false)
    
    // Fetch all data entities and populate Redux state
    useFetchAllData()

    // ------------------------------------------------------------
    // Auto-open Persona (first time) if:
    // 1) user is not persona verified
        // 2) we already have a Persona session cached in sessionStorage
    // ------------------------------------------------------------
    useEffect(() => {
        if (hasAutoStartedRef.current) return;
        if (personaVerified) return;
        if (!userId) return;

        const storageKey = `persona_verification_${userId}`;
        let cancelled = false;

        const tryOpen = (attemptsLeft: number) => {
            if (cancelled) return;
            if (hasAutoStartedRef.current) return;

            try {
                const raw = window.sessionStorage.getItem(storageKey);
                if (raw) {
                    const parsed = JSON.parse(raw) as { status?: string };
                    const status = parsed?.status;

                    if (status === "created") {
                        hasAutoStartedRef.current = true;
                        void startVerification();
                        return;
                    }

                    // If previously cancelled/completed, don't auto-open again.
                    if (status === "cancelled" || status === "completed") {
                        hasAutoStartedRef.current = true;
                        return;
                    }
                }
            } catch {
                // ignore JSON/localStorage issues
            }

            if (attemptsLeft > 0) {
                window.setTimeout(() => tryOpen(attemptsLeft - 1), 500);
                return;
            }

            // Final attempt: only start if storage is missing (first time)
            // or storage is still in-progress (created). Otherwise, don't reopen.
            try {
                const rawNow = window.sessionStorage.getItem(storageKey);
                if (rawNow) {
                    const parsedNow = JSON.parse(rawNow) as { status?: string };
                    const statusNow = parsedNow?.status;
                    if (statusNow === "created") {
                        hasAutoStartedRef.current = true;
                        void startVerification();
                    }
                    return;
                }
            } catch {
                // If storage can't be read, we can still attempt once.
            }

            hasAutoStartedRef.current = true;
            void startVerification();
        };

        // up to ~15s (helps when the preload API is slow)
        tryOpen(30);

        return () => {
            cancelled = true;
        };
    }, [personaVerified, startVerification, userId]);

    return (
        <>

            <SideBar open={open} setOpen={setOpen} sections={DASHBOARD_SECTIONS} 
            root={DASHBOARD_ROOT} permissions={permissions} />

            <main className="relative h-full transition-all duration-200 ease-soft-in-out xl:ml-66">

                <NavBar setOpen={setOpen} showPosButton={false} root={DASHBOARD_ROOT} />

                <div className="w-full m-auto overflow-x-hidden bg-[#f4f7febc] min-h-screen">

                    {children}

                </div>

            </main>

        </>
    )
}

export default DashboardLayout