import React from 'react'
import { Logo } from '@/components'

interface AuthHeaderProps {
    title: string
    description?: string
    className?: string
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
    title,
    description,
    className = ''
}) => {
    return (
        <div className={`space-y-3 flex flex-col items-center justify-center 
            text-center pb-8 ${className}`}>

            <div className='mb-2'>
                <Logo textColor="text-gray-900" size="md" iconBgColor="bg-primary" iconTextColor="text-white" />
            </div>

            <h2 className='text-2xl font-semibold text-gray-900 pt-2'>
                {title}
            </h2>

            {description && (
                <p className='text-sm text-gray-600 leading-6 max-w-md'>
                    {description}
                </p>
            )}

        </div>
    )
}

export default AuthHeader