import React from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

interface PasswordRequirementsProps {
    password?: string;
    className?: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password = '', className = '' }) => {
    const validationRules = [
        { regex: /.{8,}/, label: '8+ Characters' },
        { regex: /\d/, label: 'Number' },
        { regex: /[A-Z]/, label: 'Uppercase Letter' },
        { regex: /[a-z]/, label: 'Lowercase Letter' },
        { regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, label: 'Special Character' },
    ]

    return (
        <ul className={`grid grid-cols-2 gap-2 text-[11.5px] sm:text-xs mt-3 ${className}`}>
            {validationRules.map((rule, index) => {
                const isValid = rule.regex.test(password)

                return (
                    <li key={index}
                        className={`bg-white rounded-full px-0 flex items-center gap-x-2 mb-1 ${
                            isValid
                                ? 'text-[#35962B]'
                                : 'text-[#6E6E6E]'
                        }`}>
                        <span>
                            <CheckCircleIcon 
                                className={`size-[20px] ${isValid ? 'text-[#35962B]' : 'text-[#6E6E6E]'}`}
                            />
                        </span>
                        <span>{rule.label}</span>
                    </li>
                )
            })}
        </ul>
    )
}

export default PasswordRequirements
