import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { createRecommendation } from "../../../src/api/recommendations";
import AppButton from "../../../src/components/AppButton";
import AppInput from "../../../src/components/AppInput";
import { Priority } from "../../../src/types";

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

export default function Create() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const next: typeof errors = {};
    if (title.trim().length < 3) next.title = "Title must be at least 3 characters.";
    if (description.trim().length < 5) next.description = "Description is too short.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await createRecommendation({ title: title.trim(), description: description.trim(), priority });
      router.back(); // list reloads on focus and shows the new item
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <AppInput label="Title" value={title} onChangeText={setTitle} error={errors.title} />
        <AppInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.textarea}
          error={errors.description}
        />

        <Text style={styles.label}>Priority</Text>
        <View style={styles.segment}>
          {PRIORITIES.map((p) => (
            <Pressable
              key={p}
              onPress={() => setPriority(p)}
              style={[styles.segmentItem, priority === p && styles.segmentItemActive]}
            >
              <Text style={[styles.segmentText, priority === p && styles.segmentTextActive]}>{p}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 24 }} />
        <AppButton title="Create" onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20 },
  textarea: { minHeight: 100, textAlignVertical: "top" },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 8, color: "#374151" },
  segment: { flexDirection: "row", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 10, overflow: "hidden" },
  segmentItem: { flex: 1, paddingVertical: 12, alignItems: "center", backgroundColor: "#fff" },
  segmentItemActive: { backgroundColor: "#2563eb" },
  segmentText: { fontSize: 15, color: "#374151", fontWeight: "500" },
  segmentTextActive: { color: "#fff" },
});