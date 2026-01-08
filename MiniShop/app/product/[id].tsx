import React, { useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Image,
  View,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { getProductById } from "../../api/products";

import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/slices/cartSlice";

type ProductDetailParams = {
  id?: string | string[];
};

export default function ProductDetailScreen() {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);

  const params = useLocalSearchParams<ProductDetailParams>();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;

  const productId = Number(idParam);
  const enabled = Number.isFinite(productId) && productId > 0;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled,
  });

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Product Detail" }} />

      <View style={styles.page}>
        {!enabled ? (
          <ThemedView style={styles.center}>
            <ThemedText type="title">Invalid product id</ThemedText>
          </ThemedView>
        ) : isLoading ? (
          <ThemedView style={styles.center}>
            <ActivityIndicator />
            <ThemedText>Loading product...</ThemedText>
          </ThemedView>
        ) : isError ? (
          <ThemedView style={styles.center}>
            <ThemedText type="title">Something went wrong</ThemedText>
            <ThemedText>
              {error instanceof Error ? error.message : "Unknown error"}
            </ThemedText>

            <Pressable style={styles.retryButton} onPress={() => refetch()}>
              <ThemedText type="defaultSemiBold">Try again</ThemedText>
            </Pressable>
          </ThemedView>
        ) : !data ? (
          <ThemedView style={styles.center}>
            <ThemedText type="title">No product found</ThemedText>
          </ThemedView>
        ) : (
          <ThemedView style={styles.content}>
            <ThemedText type="title">{data.title}</ThemedText>

            <Image
              source={{ uri: data.images?.[0] ?? data.thumbnail }}
              style={styles.image}
              resizeMode="contain"
            />

            <ThemedText>{data.description}</ThemedText>
            <ThemedText type="defaultSemiBold">€ {data.price}</ThemedText>

            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              onPress={() => {
                dispatch(addToCart(data));
                setAdded(true);
                setTimeout(() => setAdded(false), 1000);
              }}
            >
              <ThemedText type="defaultSemiBold">
                {added ? "Added!" : "Add to Cart"}
              </ThemedText>
            </Pressable>

            {added && (
              <ThemedText style={styles.addedText}>Item added to cart.</ThemedText>
            )}
          </ThemedView>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  page: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },

  content: { gap: 12 },

  image: {
    width: "100%",
    height: 260,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  retryButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.35)",
  },

  addButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignSelf: "flex-start",
  },

  addButtonPressed: {
    opacity: 0.7,
  },

  addedText: {
    marginTop: 6,
    opacity: 0.8,
  },
});
