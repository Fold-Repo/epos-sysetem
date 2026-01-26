import { Suspense } from "react";
import { PurchaseReturnView } from "@/views";

export default function PurchaseReturnsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PurchaseReturnView />
        </Suspense>
    );
}
