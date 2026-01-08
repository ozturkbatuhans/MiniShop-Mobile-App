import React from "react";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "@/slices/cartSlice";
import {
  selectCartItems,
  selectSubtotal,
  selectTotalItems,
} from "@/selectors/cartSelectors";

export default function CartScreen() {
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

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Cart</ThemedText>

      {items.length === 0 ? (
        <ThemedText>Your cart is empty.</ThemedText>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <ThemedText type="subtitle">{item.title}</ThemedText>
                <ThemedText>€ {item.price.toFixed(2)}</ThemedText>

                <View style={styles.row}>
                  <Pressable
                    style={styles.qtyButton}
                    onPress={() => dispatch(decreaseQuantity(item.id))}
                  >
                    <ThemedText>-</ThemedText>
                  </Pressable>

                  <ThemedText style={styles.qtyText}>{item.quantity}</ThemedText>

                  <Pressable
                    style={styles.qtyButton}
                    onPress={() => dispatch(increaseQuantity(item.id))}
                  >
                    <ThemedText>+</ThemedText>
                  </Pressable>

                  <Pressable
                    style={styles.removeButton}
                    onPress={() => confirmRemove(item.id)}
                  >
                    <ThemedText>Remove</ThemedText>
                  </Pressable>
                </View>
              </ThemedView>
            )}
          />

          <ThemedView style={styles.summary}>
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
  card: {
    padding: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  qtyText: { minWidth: 24, textAlign: "center" },
  removeButton: {
    marginLeft: "auto",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  summary: {
    padding: 12,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
});
