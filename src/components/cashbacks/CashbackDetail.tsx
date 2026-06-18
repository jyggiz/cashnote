import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Cashback } from '@/types'
import { getCashbacks } from '@/services/api'
import { isExpired, isExpiringSoon, formatDate } from '@/utils/date'
import Layout from '@/components/shared/Layout'

export default function CashbackDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cashback, setCashback] = useState<Cashback | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCashbacks()
      .then(items => {
        const found = items.find(c => c.id === id)
        if (found) setCashback(found)
        else navigate('/cashbacks', { replace: true })
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center pt-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
        </div>
      </Layout>
    )
  }

  if (!cashback) return null

  const expired = isExpired(cashback.expiryDate)
  const expiring = !expired && isExpiringSoon(cashback.expiryDate)

  return (
    <Layout>
      <button
        onClick={() => navigate('/cashbacks')}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-teal-700 dark:text-teal-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Cashbacks
      </button>

      <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{cashback.category}</h1>
            <span className="mt-1 inline-block rounded-full bg-teal-100 px-3 py-0.5 text-lg font-bold text-teal-700 dark:bg-teal-900 dark:text-teal-300">
              {cashback.cashbackPercent}% cashback
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Bank</p>
            <p className="mt-0.5 font-medium text-gray-900 dark:text-gray-100">{cashback.bankName}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Use Card</p>
            <span
              className={`mt-0.5 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                cashback.cardOwner === 'timur'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
              }`}
            >
              {cashback.cardOwner === 'timur' ? "Timur's card" : "Dinara's card"}
            </span>
          </div>

          {cashback.merchants.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Merchants</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {cashback.merchants.map(m => (
                  <span key={m} className="rounded-lg bg-gray-100 px-2.5 py-1 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Valid Until</p>
            <p className={`mt-0.5 font-bold ${expired ? 'text-red-500' : expiring ? 'text-red-500' : 'text-gray-900 dark:text-gray-100'}`}>
              {formatDate(cashback.expiryDate)}
              {expired && ' (Expired)'}
              {expiring && ' (Expiring soon!)'}
            </p>
          </div>

          {cashback.additionalInfo && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Notes</p>
              <p className="mt-0.5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{cashback.additionalInfo}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
