import { LoginView } from "@/views";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In",
};

export default async function page() {
    return <LoginView />
}