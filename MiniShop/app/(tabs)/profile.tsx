import React from "react";
import { Pressable, StyleSheet, View, Switch } from "react-native";
import { router } from "expo-router";

import { ThemedText } from "../../components/themed-text";
import { ThemedView } from "../../components/themed-view";

import { useAppSelector } from "@/store/hooks";
import { selectSubtotal, selectTotalItems } from "@/selectors/cartSelectors";
import { useAppTheme } from "@/context/ThemeContext";

export default function ProfileScreen() {
  const totalItems = useAppSelector(selectTotalItems);
  const subtotal = useAppSelector(selectSubtotal);

  const { colorScheme, toggleTheme } = useAppTheme();
  const isDark = colorScheme === "dark";

  const surface = isDark ? styles.surfaceDark : styles.surfaceLight;

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>

      <ThemedView style={[styles.card, surface, styles.shadowCard]}>
        <ThemedText type="subtitle">Batuhan Ozturk</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.card, surface, styles.shadowCard]}>
        <ThemedText type="subtitle">Theme</ThemedText>

        <View style={styles.row}>
          <ThemedText>Light</ThemedText>
          <Switch value={isDark} onValueChange={toggleTheme} />
          <ThemedText>Dark</ThemedText>
        </View>

        <ThemedText style={styles.hint}>Toggle to switch the app theme.</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.card, surface, styles.shadowCard]}>
        <ThemedText type="subtitle">Cart Summary</ThemedText>
        <ThemedText>Total items: {totalItems}</ThemedText>
        <ThemedText>Subtotal: € {subtotal.toFixed(2)}</ThemedText>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            surface,
            styles.shadowButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.push("/(tabs)/cart")}
        >
          <ThemedText type="defaultSemiBold">Go to Cart</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },

  surfaceLight: {
    backgroundColor: "rgba(255,255,255,1)",
  },

  surfaceDark: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  card: {
    padding: 12,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.18)",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  hint: {
    opacity: 0.75,
  },

  button: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.18)",
    alignSelf: "flex-start",
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

  pressed: {
    opacity: 0.7,
  },
});


