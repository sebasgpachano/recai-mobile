import { StyleSheet, Text, View } from "react-native";

interface Props { label: string; value: number; color: string; }

export default function StatCard({ label, value, color }: Props) {
  return (
    <View style={styles.card}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: "47%", backgroundColor: "#fff", borderRadius: 14, padding: 20, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 14 },
  value: { fontSize: 34, fontWeight: "bold" },
  label: { fontSize: 14, color: "#6b7280", marginTop: 4 },
});