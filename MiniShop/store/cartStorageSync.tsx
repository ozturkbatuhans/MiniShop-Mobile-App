import { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCartItems } from "@/selectors/cartSelectors";
import { hydrateCart } from "@/slices/cartSlice";
import type { CartItem } from "@/types/cart";

const CART_KEY = "minishop_cart_v1";

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;

  return (
    typeof v.id === "number" &&
    typeof v.title === "string" &&
    typeof v.price === "number" &&
    typeof v.quantity === "number"
  );
}

function safeParseCartItems(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

export function CartStorageSync() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);

  const loaded = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(CART_KEY);
      if (raw !== null) {
        const savedItems = safeParseCartItems(raw);
        dispatch(hydrateCart(savedItems));
      }
      loaded.current = true;
    })();
  }, [dispatch]);

  useEffect(() => {
    if (!loaded.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      void AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
    }, 250);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [items]);

  return null;
}
