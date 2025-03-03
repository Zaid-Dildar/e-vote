import type { Metadata } from "next";
import "./globals.css";
import CustomToaster from "../components/UI/CustomToaster"; // Import the client component

export const metadata: Metadata = {
  title: "E-Vote",
  description: "An online Voting Platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CustomToaster /> {/* Use the Client Component for toast */}
        {children}
      </body>
    </html>
  );
}
