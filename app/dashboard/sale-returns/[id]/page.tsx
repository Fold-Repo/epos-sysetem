import { SaleReturnDetailsView } from "@/views";
import { Suspense } from "react";

export default async function SaleReturnDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <SaleReturnDetailsView returnId={id} />;
}
