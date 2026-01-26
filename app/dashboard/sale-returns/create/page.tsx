import { Suspense } from "react";
import { CreateSaleReturnView } from "@/views";

export default function CreateSaleReturnPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateSaleReturnView />
        </Suspense>
    );
}
