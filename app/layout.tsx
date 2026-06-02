import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Lens&Co — Photography Portfolio",
    description: "A curated collection of photography and video work.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-brand-dark min-h-screen">
        <Suspense fallback={null}>
            <Navbar />
        </Suspense>
        <main className="pt-16">
            {children}
        </main>
        </body>
        </html>
    );
}