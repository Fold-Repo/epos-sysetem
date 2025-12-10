import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Adjustments",
};

const AdjustmentsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>{children}</>
    )
}

export default AdjustmentsLayout