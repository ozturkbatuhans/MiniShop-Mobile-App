import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ColorSchemeName, useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeContextValue = {
  colorScheme: ColorSchemeName;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = "minishop_theme_v1";

export function ThemeProviderCustom({ children }: { children: React.ReactNode }) {
  const system = useSystemColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(system ?? "light");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === "light" || saved === "dark") {
        setColorScheme(saved);
      }
    })();
  }, []);

  const toggleTheme = () => {
    setColorScheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      void AsyncStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  const value = useMemo(() => ({ colorScheme, toggleTheme }), [colorScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  const system = useSystemColorScheme();

  if (!ctx) {
    return {
      colorScheme: system ?? "light",
      toggleTheme: () => {},
    };
  }

  return ctx;
}
