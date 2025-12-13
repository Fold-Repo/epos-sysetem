import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "People",
};

const PeopleLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>{children}</>
    )
}

export default PeopleLayout