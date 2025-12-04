import { ProductsView } from "@/views";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Products",
};

export default async function page() {
    return (
        <Suspense>
            <ProductsView />
        </Suspense>
    );
}

