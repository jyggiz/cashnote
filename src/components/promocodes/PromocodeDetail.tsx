import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Promocode } from '@/types'
import { getPromocodes } from '@/services/api'
import { isExpired, isExpiringSoon, formatDate } from '@/utils/date'
import Layout from '@/components/shared/Layout'
import Toast from '@/components/shared/Toast'

function discountLabel(p: Promocode): string {
  if (p.discountType === 'percent') return `${p.discountValue}% off`
  return `${p.discountValue} ${p.currency ?? ''} off`.trim()
}

export default function PromocodeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [promo, setPromo] = useState<Promocode | null>(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    getPromocodes()
      .then(items => {
        const found = items.find(p => p.id === id)
        if (found) setPromo(found)
        else navigate('/promocodes', { replace: true })
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const copyCode = useCallback(async () => {
    if (!promo) return
    try {
      await navigator.clipboard.writeText(promo.code)
      setToast(true)
    } catch {
      // fallback: select text
    }
  }, [promo])

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center pt-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
        </div>
      </Layout>
    )
  }

  if (!promo) return null

  const expired = promo.expiryDate ? isExpired(promo.expiryDate) : false
  const expiring = promo.expiryDate ? !expired && isExpiringSoon(promo.expiryDate) : false

  return (
    <Layout>
      <button
        onClick={() => navigate('/promocodes')}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-teal-700 dark:text-teal-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Promocodes
      </button>

      <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{promo.merchantName}</h1>
            <span className="mt-1 inline-block rounded-full bg-orange-100 px-3 py-0.5 text-lg font-bold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
              {discountLabel(promo)}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Usage</p>
            <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">{promo.usageText}</p>
          </div>

          {promo.expiryDate && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Valid Until</p>
              <p className={`mt-0.5 font-bold ${expired ? 'text-red-500' : expiring ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {formatDate(promo.expiryDate)}
                {expired && ' (Expired)'}
                {expiring && ' (Expiring soon!)'}
              </p>
            </div>
          )}

          {promo.description && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Description</p>
              <p className="mt-0.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{promo.description}</p>
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Promo Code</p>
            <button
              onClick={copyCode}
              className="w-full rounded-xl border-2 border-dashed border-teal-300 bg-teal-50 py-4 text-center transition-colors hover:bg-teal-100 active:bg-teal-200 dark:border-teal-700 dark:bg-teal-950/30 dark:hover:bg-teal-950/50"
            >
              <span className="font-mono text-xl font-bold tracking-widest text-teal-700 dark:text-teal-300">
                {promo.code}
              </span>
              <p className="mt-1 text-xs text-teal-500 dark:text-teal-400">Tap to copy</p>
            </button>
          </div>
        </div>
      </div>

      {toast && <Toast message="Copied to clipboard!" onDismiss={() => setToast(false)} />}
    </Layout>
  )
}
