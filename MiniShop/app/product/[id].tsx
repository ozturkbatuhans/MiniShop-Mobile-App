import React from "react";
import { StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

type ProductDetailParams = {
  id?: string;
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<ProductDetailParams>();

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Product Detail" }} />

      <ThemedText type="title">Product Detail</ThemedText>
      <ThemedText>Product id: {id ?? "unknown"}</ThemedText>
      <ThemedText>
        Next step: fetch product detail with TanStack Query using this id.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center", gap: 12 },
});
