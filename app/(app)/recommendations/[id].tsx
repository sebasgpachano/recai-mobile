import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { deleteRecommendation, getRecommendation, setStatus } from "../../../src/api/recommendations";
import AppButton from "../../../src/components/AppButton";
import Badge from "../../../src/components/Badge";
import { Recommendation } from "../../../src/types";

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getRecommendation(id);
          if (active) setItem(data);
        } catch {
          if (active) setError("Could not load this recommendation.");
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, [id])
  );

  async function changeStatus(status: "Accepted" | "Dismissed") {
    setActing(true);
    try {
      setItem(await setStatus(id, status));
    } catch {
      Alert.alert("Error", "Could not update the status.");
    } finally {
      setActing(false);
    }
  }

  function confirmDelete() {
    Alert.alert("Delete recommendation", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteRecommendation(id);
            router.back(); // list reloads on focus
          } catch {
            Alert.alert("Error", "Could not delete.");
          }
        },
      },
    ]);
  }

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }
  if (error || !item) {
    return <View style={styles.centered}><Text style={styles.error}>{error ?? "Not found"}</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.badges}>
        <Badge label={item.priority} />
        <Badge label={item.status} />
      </View>
      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.actions}>
        {item.status !== "Accepted" && (
          <AppButton title="Accept" onPress={() => changeStatus("Accepted")} loading={acting} />
        )}
        {item.status !== "Dismissed" && (
          <AppButton title="Dismiss" variant="secondary" onPress={() => changeStatus("Dismissed")} loading={acting} />
        )}
        <AppButton title="Delete" variant="secondary" onPress={confirmDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  error: { color: "#dc2626", fontSize: 16 },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  badges: { flexDirection: "row", gap: 8, marginBottom: 16 },
  description: { fontSize: 16, lineHeight: 24, color: "#374151", marginBottom: 32 },
  actions: { gap: 12 },
});