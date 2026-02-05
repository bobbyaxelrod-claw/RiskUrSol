import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  wallet?: string;
  email?: string;
  phone?: string;
}

export function usePrivyAuth() {
  const { user, login, logout, authenticated } = usePrivy();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);

    if (authenticated && user) {
      const linkedWallet = user.linkedAccounts?.find(
        (acc: any) => acc.type === "wallet"
      );
      const wallet = (linkedWallet as any)?.address || (user.wallet as any)?.address;

      setAuthUser({
        id: user.id,
        wallet,
        email: user.email?.address,
        phone: (user.phone as any)?.number,
      });
    } else {
      setAuthUser(null);
    }
  }, [user, authenticated]);

  return {
    user: authUser,
    isAuthenticated: authenticated,
    isLoading: loading,
    login,
    logout,
  };
}
