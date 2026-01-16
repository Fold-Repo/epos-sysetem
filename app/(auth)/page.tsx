import { LoginView } from "@/views";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AUTH_TOKEN_KEY } from "@/types";

export const metadata: Metadata = {
    title: "Sign In - StoreFornt",
    description: "Sign in to your account to continue"
};

export default async function page() {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;

    if (token) {
        redirect('/dashboard');
    }

    return <LoginView />
}
