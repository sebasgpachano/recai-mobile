import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { getRecommendations, RecommendationFilters } from "../../../src/api/recommendations";
import Badge from "../../../src/components/Badge";
import { Recommendation, RecommendationStatus } from "../../../src/types";

const STATUS_FILTERS: (RecommendationStatus | "All")[] = ["All", "Pending", "Accepted", "Dismissed"];

export default function RecommendationsList() {
  const router = useRouter();
  const [items, setItems] = useState<Recommendation[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);        // first page
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | "All">("All");

  function buildFilters(): RecommendationFilters {
    const f: RecommendationFilters = {};
    if (statusFilter !== "All") f.status = statusFilter;
    if (search.trim()) f.search = search.trim();
    return f;
  }

  // First page: replaces the list. Used on filter change and on focus.
  const loadFirst = useCallback(async (showSpinner: boolean) => {
    if (showSpinner) setLoading(true);
    setError(null);
    try {
      const page = await getRecommendations(buildFilters());
      setItems(page.items);
      setNextCursor(page.nextCursor);
    } catch {
      setError("Could not load recommendations.");
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, [search, statusFilter]);

  // Next page: appends. Triggered when the user scrolls near the end.
  async function loadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const page = await getRecommendations(buildFilters(), nextCursor);
      setItems((prev) => [...prev, ...page.items]);
      setNextCursor(page.nextCursor);
    } catch {
      // keep the items we already have; a transient error shouldn't wipe the list
    } finally {
      setLoadingMore(false);
    }
  }

  // Debounce filter/search changes.
  useEffect(() => {
    const t = setTimeout(() => loadFirst(true), 350);
    return () => clearTimeout(t);
  }, [loadFirst]);

  // Refresh first page when returning to the screen (after create/delete).
  useFocusEffect(useCallback(() => { loadFirst(false); }, [loadFirst]));

  async function onRefresh() {
    setRefreshing(true);
    await loadFirst(false);
    setRefreshing(false);
  }

  return (
    <View style={styles.flex}>
      <View style={styles.controls}>
        <TextInput
          style={styles.search}
          placeholder="Search..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        <View style={styles.chips}>
          {STATUS_FILTERS.map((s) => (
            <Pressable key={s} onPress={() => setStatusFilter(s)} style={[styles.chip, statusFilter === s && styles.chipActive]}>
              <Text style={[styles.chipText, statusFilter === s && styles.chipTextActive]}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}><ActivityIndicator size="large" /></View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={<Text style={styles.empty}>{error ?? "No recommendations match your filters."}</Text>}
          ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null}
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
      )}

      <Link href="/recommendations/create" asChild>
        <Pressable style={styles.fab}><Text style={styles.fabText}>+</Text></Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  controls: { padding: 16, gap: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  search: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  chips: { flexDirection: "row", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: "#d1d5db" },
  chipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { fontSize: 13, color: "#374151", fontWeight: "500" },
  chipTextActive: { color: "#fff" },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  cardDesc: { fontSize: 14, color: "#6b7280", marginBottom: 10 },
  badges: { flexDirection: "row", gap: 8 },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 48, paddingHorizontal: 24 },
  fab: { position: "absolute", right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: "#2563eb", justifyContent: "center", alignItems: "center", elevation: 4 },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 30 },
});