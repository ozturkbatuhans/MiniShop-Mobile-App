import React, { createContext, useContext, useMemo, useState } from "react";
import { ColorSchemeName, useColorScheme as useSystemColorScheme } from "react-native";

export type ThemeContextValue = {
  colorScheme: ColorSchemeName;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProviderCustom({ children }: { children: React.ReactNode }) {
  const system = useSystemColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(system ?? "light");

  const toggleTheme = () => {
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));
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
