import { RoleViews } from "@/views";
import { Suspense } from "react";

export default async function page() {
    return (
        <Suspense>
            <RoleViews />
        </Suspense>
    );
}

