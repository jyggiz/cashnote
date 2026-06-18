import type { HandlerEvent } from '@netlify/functions'
import { verifyToken } from './_jwt'

export function requireAuth(event: HandlerEvent): Record<string, unknown> {
  const authHeader = event.headers['authorization'] ?? event.headers['Authorization'] ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!token) throw { status: 401, message: 'Unauthorized' }
  const payload = verifyToken(token)
  if (!payload) throw { status: 401, message: 'Invalid or expired token' }
  return payload
}
