import { PaymentMtdView } from '@/views';
import { Metadata } from 'next';
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: "Payment Methods",
};

export default async function page() {
    return (
        <Suspense>
            <PaymentMtdView />
        </Suspense>
    );
}