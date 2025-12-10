import { EditQuotationView, QuotationDetailsView } from "@/views";
import { Suspense } from "react";

export default async function QuotationDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <QuotationDetailsView quotationId={id} />;
}