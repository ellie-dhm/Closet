import type { Item, ItemInput } from "./types";

const SERVER_URL = "http://localhost:3001";
const BASE_URL = `${SERVER_URL}/api/items`;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("Can't reach the server. Is it running?");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const getItems = () => request<Item[]>(BASE_URL);

export const createItem = (data: ItemInput) =>
  request<Item>(BASE_URL, { method: "POST", body: JSON.stringify(data) });

export const updateItem = (id: number, data: ItemInput) =>
  request<Item>(`${BASE_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteItem = (id: number) =>
  request<void>(`${BASE_URL}/${id}`, { method: "DELETE" });

export const imageSrc = (url: string) =>
  url.startsWith("/") ? SERVER_URL + url : url;

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  let res: Response;
  try {
    // no Content-Type header here: the browser sets it (with the file boundary) itself
    res = await fetch(`${SERVER_URL}/api/uploads`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Can't reach the server. Is it running?");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Upload failed (${res.status})`);
  }
  const data = await res.json();
  return data.url;
}
