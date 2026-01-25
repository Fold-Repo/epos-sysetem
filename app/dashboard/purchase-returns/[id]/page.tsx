import { PurchaseReturnDetailsView } from "@/views";
import { Suspense } from "react";

export default async function PurchaseReturnDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <PurchaseReturnDetailsView returnId={id} />;
}
