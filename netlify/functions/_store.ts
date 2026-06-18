import { getStore } from '@netlify/blobs'

const DATA_KEY = 'data'

export async function readStore<T>(storeName: string): Promise<T[]> {
  const store = getStore(storeName)
  const raw = await store.get(DATA_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

export async function writeStore<T>(storeName: string, items: T[]): Promise<void> {
  const store = getStore(storeName)
  await store.set(DATA_KEY, JSON.stringify(items))
}
