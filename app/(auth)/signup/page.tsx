import { SignUpView } from "@/views";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up",
};

export default async function page() {
    return <SignUpView />
}