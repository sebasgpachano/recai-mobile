import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api, setUnauthorizedHandler } from "../api/client";
import { AuthResponse } from "../types";
import { tokenStorage } from "./tokenStorage";

interface AuthState {
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore a saved session on startup.
  useEffect(() => {
    (async () => {
      const stored = await tokenStorage.get();
      setToken(stored);
      setIsLoading(false);
    })();
  }, []);

  // If any request returns 401, the interceptor calls this to drop the session.
  useEffect(() => {
    setUnauthorizedHandler(() => setToken(null));
  }, []);

  async function signIn(email: string, password: string) {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    await tokenStorage.set(data.token);
    setToken(data.token);
  }

  async function signUp(name: string, email: string, password: string) {
    const { data } = await api.post<AuthResponse>("/auth/register", { name, email, password });
    await tokenStorage.set(data.token);
    setToken(data.token);
  }

  async function signOut() {
    await tokenStorage.remove();
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}