import { PrivyProvider } from "@privy-io/react-auth";
import React from "react";

interface PrivyContextProviderProps {
  children: React.ReactNode;
}

export function PrivyContextProvider({ children }: PrivyContextProviderProps) {
  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID;

  if (!privyAppId) {
    console.error("VITE_PRIVY_APP_ID environment variable is not set");
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#00ffff",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
