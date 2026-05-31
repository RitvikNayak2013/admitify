import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admitify | AI Portfolio Operating System",
  description:
    "Admitify helps students turn dream universities into ethical, evidence-based academic and portfolio roadmaps."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
