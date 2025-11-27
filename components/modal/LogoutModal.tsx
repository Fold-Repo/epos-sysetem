"use client"

import { LogoutIcon, PopupModal } from '@/components'
import { Button } from '@heroui/react'

interface LogoutModalProps {
    open: boolean
    close: () => void
}

const LogoutModal = ({ open, close }: LogoutModalProps) => {

    return (
        <PopupModal
            size="lg"
            radius="2xl"
            isOpen={open}
            onClose={close}
            placement="center"
            title="Logout Confirmation"
            icon={<LogoutIcon className='size-5' />}
            className="max-h-screen rounded-2xl">

            <div className="p-5 space-y-8">

                <div className="text-center space-y-3">
                    <h2 className="text-lg font-medium text-gray-800">Logout Confirmation</h2>
                    <p className="text-sm text-gray-600">
                        Are you sure you want to logout from your account?
                        You will need to sign in again to access your dashboard.
                    </p>
                </div>

                <div className="space-y-2">

                    <Button onPress={close} fullWidth variant='bordered' radius='md'
                        className='text-deep-purple border-1 border-deep-purple text-xs'>
                        Return to Dashboard
                    </Button>

                    <Button fullWidth radius='md' className='text-xs bg-red-600 text-white' color='danger'>
                        Logout
                    </Button>

                </div>

            </div>

        </PopupModal>
    )
}

export default LogoutModal