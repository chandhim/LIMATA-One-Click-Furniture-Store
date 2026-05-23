import type { Metadata } from "next";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "LIMATA",
  description: "AI-assisted furniture ecommerce monorepo starter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
