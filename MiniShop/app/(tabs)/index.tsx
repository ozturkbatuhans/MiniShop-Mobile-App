import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { Link } from "expo-router";

import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function ProductListScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Product List</ThemedText>

      <ThemedText>
        Placeholder screen. Next step: fetch products with TanStack Query.
      </ThemedText>

      <Link
        href={{ pathname: "/product/[id]", params: { id: "1" } } as const}
        asChild
      >
        <Pressable style={styles.button}>
          <ThemedText type="defaultSemiBold">Go to Product 1 (Detail)</ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center", gap: 12 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
});
