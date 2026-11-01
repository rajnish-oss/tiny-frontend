import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lattice Jobs",
  description: "Find work that fits your next move."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
