import { CreateProductView } from "@/views";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Create Product",
};

export default async function page() {
    return (
        <Suspense>
            <CreateProductView />
        </Suspense>
    );
}

