import { StoresView } from "@/views";
import { Suspense } from "react";

export default function StoresPage() {
    return (
        <Suspense>
            <StoresView />
        </Suspense>
    );
}

