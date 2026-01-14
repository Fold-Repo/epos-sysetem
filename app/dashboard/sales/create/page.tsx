import { Suspense } from "react";
import { CreateSaleView } from "@/views";

export default function CreateSalePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateSaleView />
        </Suspense>
    );
}

