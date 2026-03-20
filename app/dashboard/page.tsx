;import { DashboardView } from "@/views";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Dashboard",
};

export default async function page() {
    return (
        <Suspense fallback={null}>
            <DashboardView />
        </Suspense>
    );
}