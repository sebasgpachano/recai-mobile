import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth/AuthContext";
import AppButton from "../../src/components/AppButton";
import AppInput from "../../src/components/AppInput";

export default function Login() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (!email.includes("@")) next.email = "Enter a valid email.";
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    setFormError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // No need to navigate manually: when the token is set, the (auth)
      // layout reactively redirects to /dashboard.
    } catch {
      setFormError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <Text style={styles.title}>RecAI</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <AppInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
        />
        <AppInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}

        <AppButton title="Sign in" onPress={handleSubmit} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/register" style={styles.link}>Register</Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 36, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 32 },
  formError: { color: "#dc2626", textAlign: "center", marginBottom: 12 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: "#6b7280" },
  link: { color: "#2563eb", fontWeight: "600" },
});