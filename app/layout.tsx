import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solana Tx AI",
  description: "Deterministic Solana transaction facts + AI explanations with x402 payments"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body min-h-screen">{children}</body>
    </html>
  );
}
