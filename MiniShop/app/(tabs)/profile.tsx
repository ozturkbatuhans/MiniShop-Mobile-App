import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

import { useAppSelector } from "@/store/hooks";
import { selectSubtotal, selectTotalItems } from "@/selectors/cartSelectors";

export default function ProfileScreen() {
  const totalItems = useAppSelector(selectTotalItems);
  const subtotal = useAppSelector(selectSubtotal);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>

      {/* Required: name visible in the app */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Batuhan Ozturk</ThemedText>
        <ThemedText>MiniShop Mobile App</ThemedText>
      </ThemedView>

      {/* Cross-tab proof: selectors from Redux */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Cart Summary</ThemedText>
        <ThemedText>Total items: {totalItems}</ThemedText>
        <ThemedText>Subtotal: € {subtotal.toFixed(2)}</ThemedText>

        <Pressable style={styles.button} onPress={() => router.push("/(tabs)/cart")}>
          <ThemedText type="defaultSemiBold">Go to Cart</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },

  card: {
    padding: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  button: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignSelf: "flex-start",
  },
});
