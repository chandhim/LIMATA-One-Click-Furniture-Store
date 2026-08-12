"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SocketProvider } from "./socket-provider";
import { AuthProvider } from "./auth-provider";

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
