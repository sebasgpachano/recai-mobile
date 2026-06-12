import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

export default function AppButton({ title, onPress, loading, disabled, variant = "primary" }: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" && styles.secondary,
        (isDisabled || pressed) && styles.dimmed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#2563eb"} />
      ) : (
        <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: "#2563eb", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  secondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#2563eb" },
  dimmed: { opacity: 0.6 },
  text: { color: "#fff", fontSize: 16, fontWeight: "600" },
  secondaryText: { color: "#2563eb" },
});