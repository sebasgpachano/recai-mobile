import * as SecureStore from "expo-secure-store";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const TOKEN_KEY = "recai_token";

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

  // Restore any saved session when the app starts.
  useEffect(() => {
    (async () => {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      setToken(stored);
      setIsLoading(false);
    })();
  }, []);

  // PHASE 7: mock. PHASE 8 will replace the body with a real API call.
  async function signIn(_email: string, _password: string) {
    const fakeToken = "mock-jwt-token";
    await SecureStore.setItemAsync(TOKEN_KEY, fakeToken);
    setToken(fakeToken);
  }

  async function signUp(_name: string, _email: string, _password: string) {
    const fakeToken = "mock-jwt-token";
    await SecureStore.setItemAsync(TOKEN_KEY, fakeToken);
    setToken(fakeToken);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
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