import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Sales",
};

const SalesLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>{children}</>
    )
}

export default SalesLayout