import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { Crypto } from "@/components/Crypto";
import { CryptoContainer } from "@/components/CryptoContainer";

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
      <head>
        <link
          href="https://db.onlinewebfonts.com/c/860c3ec7bbc5da3e97233ccecafe512e?family=Circular+Std+Book"
          rel="stylesheet"
        />
      </head>
      <body className="font-circular max-w-4xl mx-auto">
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}