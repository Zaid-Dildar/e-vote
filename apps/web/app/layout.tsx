import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Vote",
  description: "An online Voting Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>{children}</body>
    </html>
  );
}
