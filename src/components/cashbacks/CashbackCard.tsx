import { Link, useNavigate } from 'react-router-dom'
import type { Cashback } from '@/types'
import { isExpired, isExpiringSoon, formatDate } from '@/utils/date'
import { useAuth } from '@/hooks/useAuth'

interface CashbackCardProps {
  cashback: Cashback
  onDelete: (id: string) => void
}

export default function CashbackCard({ cashback, onDelete }: CashbackCardProps) {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const expired = isExpired(cashback.expiryDate)
  const expiring = !expired && isExpiringSoon(cashback.expiryDate)

  return (
    <div className={`rounded-2xl bg-white shadow-sm dark:bg-gray-900 ${expired ? 'opacity-60' : ''}`}>
      <Link to={`/cashbacks/${cashback.id}`} className="block p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{cashback.category}</h2>
              <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-sm font-bold text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                {cashback.cashbackPercent}%
              </span>
            </div>

            {cashback.merchants.length > 0 && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                {cashback.merchants.join(' · ')}
              </p>
            )}

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-300">{cashback.bankName}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  cashback.cardOwner === 'timur'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                }`}
              >
                {cashback.cardOwner === 'timur' ? 'Timur' : 'Dinara'}
              </span>
            </div>

            <p className={`mt-1.5 text-xs font-bold ${expired ? 'text-red-500' : expiring ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
              {expired ? 'Expired' : 'Until'} {formatDate(cashback.expiryDate)}
            </p>
          </div>

          {isAdmin && (
            <div className="flex gap-1 shrink-0" onClick={e => e.preventDefault()}>
              <button
                onClick={() => navigate(`/cashbacks/${cashback.id}/edit`)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
                aria-label="Edit"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(cashback.id)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                aria-label="Delete"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
