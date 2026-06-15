"use client";

import { Footer } from "./footer";
import { Navbar } from "./navbar";
import { ChatWidget } from "@/features/chat/components/chat-widget";

export function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      {/* Floating chat widget — renders for authenticated users only */}
      <ChatWidget />
    </>
  );
}