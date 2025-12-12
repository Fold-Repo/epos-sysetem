import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Transfers",
};

const TransfersLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>{children}</>
    )
}

export default TransfersLayout