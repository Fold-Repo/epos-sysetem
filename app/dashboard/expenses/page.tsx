import { ExpensesView } from "@/views";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: " Expenses",
}

export default async function page() {
    return (
        <Suspense>
            <ExpensesView />
        </Suspense>
    );
}

