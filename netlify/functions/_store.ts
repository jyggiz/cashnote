import { getStore } from '@netlify/blobs'

const DATA_KEY = 'data'

function store(name: string) {
  return getStore({
    name,
    siteID: process.env.NETLIFY_SITE_ID ?? '',
    token: process.env.NETLIFY_TOKEN ?? '',
  })
}

export async function readStore<T>(storeName: string): Promise<T[]> {
  const raw = await store(storeName).get(DATA_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as T[]
  } catch {
    return []
  }
}

export async function writeStore<T>(storeName: string, items: T[]): Promise<void> {
  await store(storeName).set(DATA_KEY, JSON.stringify(items))
}
