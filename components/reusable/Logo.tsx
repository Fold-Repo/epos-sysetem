import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib'

interface LogoProps {
    href?: string
    className?: string
    textColor?: string
    iconBgColor?: string
    iconTextColor?: string
    size?: 'sm' | 'md' | 'lg'
}

const Logo: React.FC<LogoProps> = ({
    href = '/',
    className = '',
    textColor = 'text-white',
    iconBgColor = 'bg-yellow',
    iconTextColor = 'text-white',
    size = 'md'
}) => {
    const sizeClasses = {
        sm: {
            icon: 'w-8 h-8 text-lg',
            text: 'text-lg'
        },
        md: {
            icon: 'w-10 h-10 text-2xl',
            text: 'text-2xl'
        },
        lg: {
            icon: 'w-12 h-12 text-3xl',
            text: 'text-3xl'
        }
    }

    const currentSize = sizeClasses[size]

    return (
        <Link
            href={href}
            className={cn("flex items-center space-x-2", className)}
        >
            <div className={cn(
                currentSize.icon,
                iconBgColor,
                "rounded-lg flex items-center justify-center",
                iconTextColor,
                "font-black shadow-lg"
            )}>
                S
            </div>
            <span className={cn(
                textColor,
                currentSize.text,
                "font-bold tracking-tight"
            )}>
                Sh<span className={iconBgColor.replace('bg-', 'text-')}>o</span>rp
            </span>
        </Link>
    )
}

export default Logo
