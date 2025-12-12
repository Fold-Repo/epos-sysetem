import { CurrencyView } from "@/views";
import { Suspense } from "react";

export default async function CurrenciesPage() {
    return (
        <Suspense>
            <CurrencyView />
        </Suspense>
    );
}

