import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Max Murdoch",
  description: "Founding Designer at Jack & Jill",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
