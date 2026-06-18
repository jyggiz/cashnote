import type { Cashback, HelpfulInfo, Promocode } from '@/types'

const BASE = '/.netlify/functions'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('cashnote_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function req<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, headers: { ...authHeaders(), ...options?.headers } })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${res.status}: ${text}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// Cashbacks
export const getCashbacks = () => req<Cashback[]>(`${BASE}/cashbacks`)
export const createCashback = (data: Omit<Cashback, 'id' | 'createdAt' | 'updatedAt'>) =>
  req<Cashback>(`${BASE}/cashbacks`, { method: 'POST', body: JSON.stringify(data) })
export const updateCashback = (id: string, data: Partial<Cashback>) =>
  req<Cashback>(`${BASE}/cashbacks?id=${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteCashback = (id: string) =>
  req<void>(`${BASE}/cashbacks?id=${id}`, { method: 'DELETE' })

// Promocodes
export const getPromocodes = () => req<Promocode[]>(`${BASE}/promocodes`)
export const createPromocode = (data: Omit<Promocode, 'id' | 'createdAt'>) =>
  req<Promocode>(`${BASE}/promocodes`, { method: 'POST', body: JSON.stringify(data) })
export const updatePromocode = (id: string, data: Partial<Promocode>) =>
  req<Promocode>(`${BASE}/promocodes?id=${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deletePromocode = (id: string) =>
  req<void>(`${BASE}/promocodes?id=${id}`, { method: 'DELETE' })

// Helpful Info
export const getHelpfulInfo = () => req<HelpfulInfo[]>(`${BASE}/helpful-info`)
export const createHelpfulInfo = (data: Omit<HelpfulInfo, 'id' | 'createdAt'>) =>
  req<HelpfulInfo>(`${BASE}/helpful-info`, { method: 'POST', body: JSON.stringify(data) })
export const updateHelpfulInfo = (id: string, data: Partial<HelpfulInfo>) =>
  req<HelpfulInfo>(`${BASE}/helpful-info?id=${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteHelpfulInfo = (id: string) =>
  req<void>(`${BASE}/helpful-info?id=${id}`, { method: 'DELETE' })
