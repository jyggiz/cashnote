import type { Handler } from '@netlify/functions'
import { randomUUID } from 'crypto'
import type { Cashback } from '../../src/types'
import { requireAuth } from './_auth'
import { readStore, writeStore } from './_store'

const STORE = 'cashbacks'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

export const handler: Handler = async (event, _context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' }
  }

  try {
    if (event.httpMethod === 'GET') {
      requireAuth(event)
      const items = await readStore<Cashback>(STORE)
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      }
    }

    if (event.httpMethod === 'POST') {
      requireAuth(event)
      const data = JSON.parse(event.body ?? '{}') as Omit<Cashback, 'id' | 'createdAt' | 'updatedAt'>
      const items = await readStore<Cashback>(STORE)
      const now = new Date().toISOString()
      const newItem: Cashback = { ...data, id: randomUUID(), createdAt: now, updatedAt: now }
      items.push(newItem)
      await writeStore(STORE, items)
      return {
        statusCode: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      }
    }

    if (event.httpMethod === 'PUT') {
      requireAuth(event)
      const id = event.queryStringParameters?.id
      if (!id) return { statusCode: 400, headers: corsHeaders, body: 'Missing id' }
      const data = JSON.parse(event.body ?? '{}') as Partial<Cashback>
      const items = await readStore<Cashback>(STORE)
      const idx = items.findIndex(i => i.id === id)
      if (idx === -1) return { statusCode: 404, headers: corsHeaders, body: 'Not found' }
      items[idx] = { ...items[idx], ...data, id, updatedAt: new Date().toISOString() }
      await writeStore(STORE, items)
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(items[idx]),
      }
    }

    if (event.httpMethod === 'DELETE') {
      requireAuth(event)
      const id = event.queryStringParameters?.id
      if (!id) return { statusCode: 400, headers: corsHeaders, body: 'Missing id' }
      const items = await readStore<Cashback>(STORE)
      const filtered = items.filter(i => i.id !== id)
      if (filtered.length === items.length) return { statusCode: 404, headers: corsHeaders, body: 'Not found' }
      await writeStore(STORE, filtered)
      return { statusCode: 204, headers: corsHeaders, body: '' }
    }

    return { statusCode: 405, headers: corsHeaders, body: 'Method not allowed' }
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string }
    if (e.status) {
      return { statusCode: e.status, headers: corsHeaders, body: e.message ?? 'Error' }
    }
    console.error(err)
    return { statusCode: 500, headers: corsHeaders, body: 'Internal server error' }
  }
}
