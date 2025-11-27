;import { DashboardView } from "@/views";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
};

export default async function page() {
    return <DashboardView />;
}