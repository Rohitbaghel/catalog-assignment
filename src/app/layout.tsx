import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Crypto } from "@/components/Crypto";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "A comprehensive crypto dashboard"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} max-w-4xl mx-auto`}>
        <Providers>
          <Crypto />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}