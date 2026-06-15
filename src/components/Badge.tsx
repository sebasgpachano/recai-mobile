import { StyleSheet, Text, View } from "react-native";

const COLORS: Record<string, { bg: string; fg: string }> = {
  Low: { bg: "#dcfce7", fg: "#166534" },
  Medium: { bg: "#fef3c7", fg: "#92400e" },
  High: { bg: "#fee2e2", fg: "#991b1b" },
  Pending: { bg: "#fef3c7", fg: "#92400e" },
  Accepted: { bg: "#dcfce7", fg: "#166534" },
  Dismissed: { bg: "#e5e7eb", fg: "#374151" },
};

export default function Badge({ label }: { label: string }) {
  const c = COLORS[label] ?? { bg: "#e5e7eb", fg: "#374151" };
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: "flex-start" },
  text: { fontSize: 12, fontWeight: "600" },
});