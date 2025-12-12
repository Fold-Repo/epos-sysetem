import { PurchaseDetailsView } from "@/views";
import { Suspense } from "react";

export default async function PurchaseDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <PurchaseDetailsView purchaseId={id} />;
}

