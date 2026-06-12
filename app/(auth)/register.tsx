import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth/AuthContext";
import AppButton from "../../src/components/AppButton";
import AppInput from "../../src/components/AppInput";

export default function Register() {
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Name is required.";
    if (!email.includes("@")) next.email = "Enter a valid email.";
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    if (confirm !== password) next.confirm = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    setFormError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      // Reactive redirect handles navigation once the token is set.
    } catch {
      setFormError("Could not register. The email may already be in use.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join RecAI</Text>

        <AppInput label="Name" value={name} onChangeText={setName} error={errors.name} />
        <AppInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
        />
        <AppInput label="Password" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />
        <AppInput label="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry error={errors.confirm} />

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}

        <AppButton title="Register" onPress={handleSubmit} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/login" style={styles.link}>Sign in</Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flexGrow: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 32 },
  formError: { color: "#dc2626", textAlign: "center", marginBottom: 12 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: "#6b7280" },
  link: { color: "#2563eb", fontWeight: "600" },
});