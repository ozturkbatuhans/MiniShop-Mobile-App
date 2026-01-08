import { useColorScheme as useSystemColorScheme } from "react-native";
import { useContext } from "react";

import { ThemeContext } from "../context/ThemeContext";

export function useColorScheme() {
  const system = useSystemColorScheme();
  const ctx = useContext(ThemeContext);

  return (ctx?.colorScheme ?? system ?? "light") as "light" | "dark";
}
