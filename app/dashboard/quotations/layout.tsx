import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Quotations",
};

const QuotationsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>{children}</>
    )
}

export default QuotationsLayout