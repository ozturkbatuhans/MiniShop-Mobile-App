import type { Product } from "@/types/product";

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

const BASE_URL = "https://dummyjson.com";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function getProducts(params?: { limit?: number; skip?: number }): Promise<ProductsResponse> {
  const limit = params?.limit ?? 30;
  const skip = params?.skip ?? 0;
  return fetchJson<ProductsResponse>(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
}

export async function searchProducts(params: {
  q: string;
  limit?: number;
  skip?: number;
}): Promise<ProductsResponse> {
  const limit = params.limit ?? 30;
  const skip = params.skip ?? 0;
  const q = encodeURIComponent(params.q);
  return fetchJson<ProductsResponse>(`${BASE_URL}/products/search?q=${q}&limit=${limit}&skip=${skip}`);
}

export async function getProductById(id: number): Promise<Product> {
  return fetchJson<Product>(`${BASE_URL}/products/${id}`);
}
