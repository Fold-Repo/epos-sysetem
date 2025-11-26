import { ResetPasswordView } from "@/views";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot Password",
};

export default async function page() {
    return <ResetPasswordView />
}

