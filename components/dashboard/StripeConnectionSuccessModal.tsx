'use client'

import Image from 'next/image'
import { Button, PopupModal } from '@/components'
import { fetchBusinessConnectStatus } from '@/store'
import { useAppDispatch } from '@/store/hooks'

interface StripeConnectionSuccessModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function StripeConnectionSuccessModal({
    isOpen,
    onClose,
}: StripeConnectionSuccessModalProps) {
    const dispatch = useAppDispatch()

    const handleClose = () => {
        // ======================================================
        // REFRESH CONNECT STATUS
        // ======================================================
        void dispatch(fetchBusinessConnectStatus())

        // ======================================================
        // CLOSE MODAL
        // ======================================================
        onClose()
    }

    return (
        <PopupModal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            radius="2xl"
            showCloseButton
            backdrops='blur'
            isDismissable={false}>

            <div className="p-2">
                <div className="relative mx-auto rounded-2xl border border-white/20 bg-linear-to-br from-green-500/10 via-blue-500/10 to-transparent p-5 overflow-hidden">
                    <div
                        className="absolute -inset-24 blur-2xl opacity-40"
                        style={{
                            background:
                                'radial-gradient(circle at top, rgba(34,197,94,0.65), transparent 60%), radial-gradient(circle at bottom, rgba(59,130,246,0.6), transparent 65%)',
                        }}
                    />

                    <div className="relative flex flex-col items-center text-center gap-4">
                        <div className="relative">
                            <div className="absolute -inset-3 rounded-full bg-white/10 blur-xl" />
                            <div className="relative rounded-2xl border border-white/20 bg-white/5 p-3">
                                <Image
                                    src="/img/success.gif"
                                    width={140}
                                    height={140}
                                    alt="Success animation"
                                    unoptimized
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm font-semibold text-gray-900">
                                Stripe onboarding is done
                            </div>
                            <div className="text-xs text-gray-600">
                                You can now start managing your business from your dashboard.
                            </div>
                        </div>

                        <div className="w-full pt-1 flex justify-center">
                            <Button
                                size="sm"
                                className="bg-primary text-white h-9 px-4 text-[11px]"
                                onPress={handleClose}>
                                Go to dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </PopupModal>
    )
}

