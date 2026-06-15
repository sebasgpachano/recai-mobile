import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { getRecommendations } from "../../../src/api/recommendations";
import Badge from "../../../src/components/Badge";
import { Recommendation } from "../../../src/types";

export default function RecommendationsList() {
  const router = useRouter();
  const [items, setItems] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await getRecommendations());
    } catch {
      setError("Could not load recommendations.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        await load();
        if (active) setLoading(false);
      })();
      return () => { active = false; };
    }, [load])
  );

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.flex}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {error ?? "No recommendations yet. Tap + to create one."}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => router.push({ pathname: "/recommendations/[id]", params: { id: item.id } })}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.badges}>
              <Badge label={item.priority} />
              <Badge label={item.status} />
            </View>
          </Pressable>
        )}
      />
      <Link href="/recommendations/create" asChild>
        <Pressable style={styles.fab}><Text style={styles.fabText}>+</Text></Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardDesc: { fontSize: 14, color: "#6b7280", marginBottom: 10 },
  badges: { flexDirection: "row", gap: 8 },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 48, paddingHorizontal: 24 },
  fab: { position: "absolute", right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: "#2563eb", justifyContent: "center", alignItems: "center", elevation: 4 },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 30 },
});