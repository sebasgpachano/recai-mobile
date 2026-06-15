import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { getDashboard } from "../../src/api/recommendations";
import { useAuth } from "../../src/auth/AuthContext";
import AppButton from "../../src/components/AppButton";
import StatCard from "../../src/components/StatCard";
import { DashboardStats } from "../../src/types";

export default function Dashboard() {
  const { signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reload every time the tab gains focus, so it reflects new/accepted items.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getDashboard();
          if (active) setStats(data);
        } catch {
          if (active) setError("Could not load the dashboard.");
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => { active = false; };
    }, [])
  );

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator size="large" /></View>;
  }
  if (error || !stats) {
    return <View style={styles.centered}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Overview</Text>
      <View style={styles.grid}>
        <StatCard label="Total" value={stats.total} color="#2563eb" />
        <StatCard label="Pending" value={stats.pending} color="#d97706" />
        <StatCard label="Accepted" value={stats.accepted} color="#16a34a" />
        <StatCard label="Dismissed" value={stats.dismissed} color="#6b7280" />
      </View>
      <AppButton title="Sign out" variant="secondary" onPress={signOut} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  error: { color: "#dc2626", fontSize: 16 },
  container: { padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 8 },
});