import type { Metadata } from "next";
import { Manrope, Inter, Rubik } from "next/font/google";
import "@/styles/globals.css";
import { cn, generateMetadata } from "@/utils";
import Providers from "@/components/global/providers";
import Header from "@/components/header";
import MobileHeader from "@/components/mobile-header";
import { createClient } from "@/lib";

const font = Inter({
    subsets: ["latin"],
});

export const metadata = generateMetadata();

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <html lang="en">
            <body
                className={cn(
                    "min-h-screen bg-background text-foreground antialiased",
                    font.className,
                )}
            >
                <Providers>
                    <Header user={user!} />
                    <MobileHeader user={user!} />
                    {children}
                </Providers>
            </body>
        </html>
    );
};
