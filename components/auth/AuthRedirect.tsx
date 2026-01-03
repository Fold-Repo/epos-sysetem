import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib'

interface AuthRedirectProps {
  question: string
  linkText: string
  href?: string
  className?: string
  onClick?: () => void
  disabled?: boolean
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ question, linkText, href, className,
  onClick, disabled = false }) => {

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };

  return (
    <p className={cn("text-xs space-y-5 mt-4", className)}>
      {question}{' '}
      {href ? (
        <Link className="text-primary underline font-medium" href={href}>
          {linkText}
        </Link>
      ) : (
        <button 
          type="button"
          onClick={handleClick} 
          disabled={disabled} 
          className={cn(
            "text-primary underline font-medium",
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          )}
        >
          {linkText}
        </button>
      )}
    </p>
  )
}

export default AuthRedirect
