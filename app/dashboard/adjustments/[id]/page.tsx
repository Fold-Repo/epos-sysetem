import { AdjustmentDetailsView } from "@/views";
import { Suspense } from "react";

export default async function AdjustmentDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <AdjustmentDetailsView adjustmentId={id} />;
}

