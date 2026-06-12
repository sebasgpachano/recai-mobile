import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../src/auth/AuthContext";

export default function AuthLayout() {
  const { token } = useAuth();
  if (token) return <Redirect href="/dashboard" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}