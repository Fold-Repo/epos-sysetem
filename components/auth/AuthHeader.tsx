import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LOGO } from '@/constants'

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
    <div className={`space-y-1.5 flex flex-col items-center justify-center 
            text-center pb-12 ${className}`}>

        <Link href="/" className='block'>
            <Image src={LOGO.logo_1} alt="Logo" width={100} height={48} />
        </Link>

        <h2 className='text-lg font-medium pt-2'>
            {title}
        </h2>

        {description && (
            <p className='text-sm font-light text-[#6C7278] leading-5'>
                {description}
            </p>
        )}

    </div>
  )
}

export default AuthHeader