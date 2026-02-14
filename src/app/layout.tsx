import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AudioProvider } from "@/components/AudioProvider";

export const metadata: Metadata = {
    title: "Ms Rozhan",
    description: "A special Valentine surprise for Kayla Saldrina",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
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
