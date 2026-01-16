'use client'

import React from 'react'

interface RippleEffectProps {
    className?: string
}

const RippleEffect: React.FC<RippleEffectProps> = ({ className = '' }) => {
    return (
        <div className={`absolute bottom-0 right-0 pointer-events-none overflow-hidden ${className}`}>
            <div className="relative w-[600px] h-[600px] -mr-[300px] -mb-[300px]">
                {/* Ripple circles with expanding animation */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/20 ripple-animation-1"></div>
                <div className="absolute inset-0 rounded-full border-2 border-primary/15 ripple-animation-2"></div>
                <div className="absolute inset-0 rounded-full border border-primary/10 ripple-animation-3"></div>
            </div>
        </div>
    )
}

export default RippleEffect
