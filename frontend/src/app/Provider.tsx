import { useState, type ReactNode } from "react";
import { queryConfig } from "@/lib/reactQuery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// This file is the location for all providers for the app (ex. query, helmet, errors, etc.)
// TODO: Other providers may come here in the future

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  // Init queryClient in provider as state ():
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: queryConfig,
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
