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
    <p className={cn("text-sm text-gray-600", className)}>
      {question}{' '}
      {href ? (
        <Link className="text-primary font-semibold hover:text-primary/80 transition-colors" href={href}>
          {linkText}
        </Link>
      ) : (
        <button 
          type="button"
          onClick={handleClick} 
          disabled={disabled} 
          className={cn(
            "text-primary font-semibold hover:text-primary/80 transition-colors",
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
