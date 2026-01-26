import { Suspense } from "react";
import { SaleReturnView } from "@/views";

export default function SaleReturnsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SaleReturnView />
        </Suspense>
    );
}
