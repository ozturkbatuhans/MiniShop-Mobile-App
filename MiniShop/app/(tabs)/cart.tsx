import React from "react";
import { StyleSheet } from "react-native";

import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

export default function CartScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Cart</ThemedText>
      <ThemedText>Placeholder. Next step: Redux cartSlice.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "center", gap: 12 },
});
