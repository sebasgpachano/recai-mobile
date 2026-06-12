import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RecAI</Text>
      <Text style={styles.subtitle}>Setup complete ✅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 8 },
});