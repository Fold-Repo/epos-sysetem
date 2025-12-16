import { SettingsView } from "@/views";
import { Suspense } from "react";

export default async function page() {
    return (
        <Suspense>
            <SettingsView />
        </Suspense>
    );
}

