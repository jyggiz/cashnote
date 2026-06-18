import type { Handler } from '@netlify/functions'
import { signToken } from './_jwt'

const USERNAME = process.env.AUTH_USERNAME ?? 'admin'
const PASSWORD = process.env.AUTH_PASSWORD ?? 'cashnote123'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export const handler: Handler = async event => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors, body: '' }
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: 'Method not allowed' }

  const { username, password } = JSON.parse(event.body ?? '{}') as { username?: string; password?: string }

  if (!username || !password || username !== USERNAME || password !== PASSWORD) {
    return {
      statusCode: 401,
      headers: { ...cors, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid credentials' }),
    }
  }

  const token = signToken({
    sub: username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  })

  return {
    statusCode: 200,
    headers: { ...cors, 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, username }),
  }
}
