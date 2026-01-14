import { Suspense } from "react";
import { PurchaseView } from "@/views";

export default function PurchasesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PurchaseView />
        </Suspense>
    );
}

