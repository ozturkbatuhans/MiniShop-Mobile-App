import type { Product, ProductsResponse } from "../types/product";

const BASE_URL = "https://dummyjson.com";

async function fetchJson<T>(url: string, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Request failed (${res.status}): ${text}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown network error";

    if (message.includes("AbortError") || message.includes("aborted")) {
      throw new Error("Request timed out. Please try again.");
    }

    if (message.toLowerCase().includes("network")) {
      throw new Error("Network request failed. Please check your connection.");
    }

    throw err instanceof Error ? err : new Error("Unknown error");
  } finally {
    clearTimeout(timeoutId);
  }
}

export function getProducts(): Promise<ProductsResponse> {
  return fetchJson<ProductsResponse>(`${BASE_URL}/products`);
}

export function getProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/${id}`);
}
