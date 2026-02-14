import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "@/components/AudioProvider";

export const metadata: Metadata = {
    title: "Happy Valentine's Day, Kayla 💕",
    description: "A special Valentine surprise for Kayla Saldrina",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AudioProvider>
                    {children}
                </AudioProvider>
            </body>
        </html>
    );
}
