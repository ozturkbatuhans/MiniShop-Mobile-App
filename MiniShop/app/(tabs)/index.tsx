import React from "react";
import {
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  Image,
  View,
  useColorScheme,
} from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../../api/products";
import type { Product } from "../../types/product";

import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function ProductListScreen() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
        <ThemedText>Loading products...</ThemedText>
      </ThemedView>
    );
  }

  if (isError) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="title">Something went wrong</ThemedText>
        <ThemedText>
          {error instanceof Error ? error.message : "Unknown error"}
        </ThemedText>

        <Pressable style={styles.button} onPress={() => refetch()}>
          <ThemedText type="defaultSemiBold">Try again</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  const products = data?.products ?? [];

  if (products.length === 0) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="title">No products</ThemedText>
        <ThemedText>Please try again later.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.page}>
        <ThemedText type="title">Product List</ThemedText>

        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      </View>
    </ThemedView>
  );
}

function ProductCard({ product }: { product: Product }) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  return (
    <Link
      href={
        { pathname: "/product/[id]", params: { id: String(product.id) } } as const
      }
      asChild
    >
      <Pressable
        style={({ pressed }) => [
          styles.card,
          isDark ? styles.cardDark : styles.cardLight,
          styles.shadowCard,
          pressed && styles.pressed,
        ]}
      >
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.thumb}
          resizeMode="cover"
        />

        <View style={styles.cardBody}>
          <ThemedText type="defaultSemiBold" numberOfLines={1}>
            {product.title}
          </ThemedText>

          <ThemedText numberOfLines={2} style={styles.muted}>
            {product.description}
          </ThemedText>

          <View style={styles.priceRow}>
            <ThemedText type="defaultSemiBold">€ {product.price}</ThemedText>
            <ThemedText style={styles.linkHint}>View</ThemedText>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  page: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
  },

  list: { gap: 12, paddingVertical: 12 },

  center: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  card: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.18)",
    alignItems: "center",
  },

  cardLight: {
    backgroundColor: "rgba(255,255,255,1)",
  },

  cardDark: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  shadowCard: {
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  pressed: { opacity: 0.75 },

  thumb: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.06)",
  },

  cardBody: {
    flex: 1,
    gap: 6,
  },

  muted: {
    opacity: 0.8,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },

  linkHint: {
    opacity: 0.7,
  },

  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.35)",
  },
});

