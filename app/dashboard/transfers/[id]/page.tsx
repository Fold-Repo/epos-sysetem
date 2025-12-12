import { TransferDetailsView } from "@/views";
import { Suspense } from "react";

export default async function TransferDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <TransferDetailsView transferId={id} />;
}

