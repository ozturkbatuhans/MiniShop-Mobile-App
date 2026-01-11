import React from "react";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { decreaseQuantity, increaseQuantity, removeItem } from "@/slices/cartSlice";
import { selectCartItems, selectSubtotal, selectTotalItems } from "@/selectors/cartSelectors";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function CartScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const totalItems = useAppSelector(selectTotalItems);
  const subtotal = useAppSelector(selectSubtotal);

  const confirmRemove = (id: number) => {
    Alert.alert(
      "Remove item",
      "Are you sure you want to remove this item from the cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => dispatch(removeItem(id)),
        },
      ]
    );
  };

  const cardSurface = isDark ? styles.surfaceDark : styles.surfaceLight;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Cart</ThemedText>

      {items.length === 0 ? (
        <ThemedView style={[styles.emptyCard, cardSurface, styles.shadowCard]}>
          <ThemedText>Your cart is empty.</ThemedText>
        </ThemedView>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const lineTotal = item.price * item.quantity;

              return (
                <ThemedView style={[styles.card, cardSurface, styles.shadowCard]}>
                  <View style={styles.topRow}>
                    <ThemedText type="subtitle" style={styles.title} numberOfLines={1}>
                      {item.title}
                    </ThemedText>
                  </View>

                  <View style={styles.priceRow}>
                    <ThemedText>€ {item.price.toFixed(2)}</ThemedText>
                    <ThemedText style={styles.muted}>
                      Line total: € {lineTotal.toFixed(2)}
                    </ThemedText>
                  </View>

                  <View style={styles.row}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.qtyButton,
                        cardSurface,
                        styles.shadowButton,
                        pressed && styles.pressed,
                      ]}
                      onPress={() => dispatch(decreaseQuantity(item.id))}
                    >
                      <ThemedText>-</ThemedText>
                    </Pressable>

                    <ThemedText style={styles.qtyText}>{item.quantity}</ThemedText>

                    <Pressable
                      style={({ pressed }) => [
                        styles.qtyButton,
                        cardSurface,
                        styles.shadowButton,
                        pressed && styles.pressed,
                      ]}
                      onPress={() => dispatch(increaseQuantity(item.id))}
                    >
                      <ThemedText>+</ThemedText>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.removeButton,
                        cardSurface,
                        styles.shadowButton,
                        pressed && styles.pressed,
                      ]}
                      onPress={() => confirmRemove(item.id)}
                    >
                      <ThemedText>Remove</ThemedText>
                    </Pressable>
                  </View>
                </ThemedView>
              );
            }}
          />

          <ThemedView style={[styles.summary, cardSurface, styles.shadowCard]}>
            <ThemedText>Total items: {totalItems}</ThemedText>
            <ThemedText>Subtotal: € {subtotal.toFixed(2)}</ThemedText>
          </ThemedView>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  list: { gap: 12, paddingBottom: 12 },

  surfaceLight: {
    backgroundColor: "rgba(255,255,255,1)",
  },

  surfaceDark: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  card: {
    padding: 12,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.18)",
  },

  emptyCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.18)",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: { flex: 1 },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  muted: { opacity: 0.75 },

  row: { flexDirection: "row", alignItems: "center", gap: 10 },

  qtyButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.18)",
    minWidth: 44,
    alignItems: "center",
  },

  qtyText: { minWidth: 24, textAlign: "center" },

  removeButton: {
    marginLeft: "auto",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.18)",
  },

  summary: {
    padding: 12,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.18)",
  },

  shadowCard: {
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  shadowButton: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  pressed: { opacity: 0.7 },
});
