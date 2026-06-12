import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../src/auth/AuthContext";
import AppButton from "../../src/components/AppButton";

export default function Dashboard() {
  const { signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>You're signed in 🎉</Text>
      <View style={{ height: 24 }} />
      <AppButton title="Sign out" variant="secondary" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "#6b7280", marginTop: 8 },
});