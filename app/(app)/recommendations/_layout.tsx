import { Stack } from "expo-router";

export default function RecommendationsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Recommendations" }} />
      <Stack.Screen name="[id]" options={{ title: "Detail" }} />
      <Stack.Screen name="create" options={{ title: "New Recommendation", presentation: "modal" }} />
    </Stack>
  );
}