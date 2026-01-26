import { Suspense } from "react";
import { CreatePurchaseReturnView } from "@/views";

export default function CreatePurchaseReturnPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreatePurchaseReturnView />
        </Suspense>
    );
}
