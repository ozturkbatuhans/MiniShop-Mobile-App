import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Card } from "@/components/ui/card";
import { PrimaryButton } from "@/components/ui/primary-button";

import { getProducts, searchProducts } from "@/api/products";
import type { Product } from "@/types/product";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";

export default function ProductListScreen() {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebouncedValue(searchText.trim(), 350);

  const isSearching = debouncedSearch.length > 0;

  const query = useQuery({
    queryKey: ["products", debouncedSearch],
    queryFn: () => {
      if (isSearching) {
        return searchProducts({ q: debouncedSearch, limit: 30, skip: 0 });
      }
      return getProducts({ limit: 30, skip: 0 });
    },
  });

  const products = query.data?.products ?? [];

  const header = useMemo(() => {
    return (
      <View style={{ gap: 12 }}>
        <ThemedText type="title" style={styles.title}>
          Product List
        </ThemedText>

        <Card style={styles.searchCard}>
          <View style={styles.searchRow}>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search products..."
              placeholderTextColor={theme.icon}
              style={[
                styles.searchInput,
                { color: theme.text },
              ]}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
            />

            {searchText.length > 0 && (
              <Pressable
                onPress={() => setSearchText("")}
                style={({ pressed }) => [
                  styles.clearBtn,
                  { opacity: pressed ? 0.6 : 1, borderColor: theme.tint },
                ]}
              >
                <ThemedText style={{ color: theme.tint, fontWeight: "800" }}>Clear</ThemedText>
              </Pressable>
            )}
          </View>

          {isSearching && (
            <ThemedText style={{ marginTop: 8, opacity: 0.75 }}>
              Showing results for: "{debouncedSearch}"
            </ThemedText>
          )}
        </Card>
      </View>
    );
  }, [searchText, debouncedSearch, isSearching, theme.icon, theme.text, theme.tint]);

  if (query.isPending) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator />
        <ThemedText style={styles.centerText}>Loading products...</ThemedText>
      </ThemedView>
    );
  }

  if (query.isError) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText type="title">Something went wrong</ThemedText>
        <ThemedText style={styles.centerText}>
          {query.error instanceof Error ? query.error.message : "Unknown error"}
        </ThemedText>

        <PrimaryButton
          title={query.isRefetching ? "Retrying..." : "Retry"}
          onPress={() => query.refetch()}
          disabled={query.isRefetching}
          style={{ marginTop: 12 }}
        />
      </ThemedView>
    );
  }

  if (products.length === 0) {
    return (
      <ThemedView style={styles.screen}>
        {header}
        <ThemedView style={styles.emptyBox}>
          <ThemedText type="title">
            {isSearching ? "No results" : "No products"}
          </ThemedText>
          <ThemedText style={{ opacity: 0.75, marginTop: 8, textAlign: "center" }}>
            {isSearching
              ? "Try a different search term."
              : "The product list is empty."}
          </ThemedText>

          <PrimaryButton
            title={query.isRefetching ? "Reloading..." : "Reload"}
            onPress={() => query.refetch()}
            disabled={query.isRefetching}
            style={{ marginTop: 12 }}
          />
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ProductRow item={item} tint={theme.tint} />}
      />
    </ThemedView>
  );
}

function ProductRow({ item, tint }: { item: Product; tint: string }) {
  return (
    <Card>
      <View style={styles.row}>
        <Image source={{ uri: item.thumbnail }} style={styles.thumb} resizeMode="cover" />

        <View style={styles.info}>
          <ThemedText style={styles.productTitle}>{item.title}</ThemedText>

          <ThemedText numberOfLines={2} style={styles.desc}>
            {item.description}
          </ThemedText>

          <View style={styles.bottomRow}>
            <ThemedText style={styles.price}>€ {item.price.toFixed(2)}</ThemedText>

            <Link
              href={
                {
                  pathname: "/product/[id]",
                  params: { id: String(item.id) },
                } as const
              }
              asChild
            >
              <Pressable
                style={({ pressed }) => [
                  styles.viewBtn,
                  { borderColor: tint, opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <ThemedText style={{ color: tint, fontWeight: "900" }}>View</ThemedText>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  title: { marginBottom: 4 },

  list: { gap: 12, paddingBottom: 24 },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16, gap: 8 },
  centerText: { textAlign: "center" },

  emptyBox: {
    marginTop: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  searchCard: { marginTop: 8 },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D6D6D6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  clearBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  row: { flexDirection: "row", gap: 12 },
  thumb: { width: 72, height: 72, borderRadius: 12 },
  info: { flex: 1, gap: 6 },

  productTitle: { fontSize: 16, fontWeight: "800" },
  desc: { opacity: 0.8 },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },

  price: { fontSize: 15, fontWeight: "800" },

  viewBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 90,
  },
});
