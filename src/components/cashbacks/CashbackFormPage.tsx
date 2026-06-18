import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Cashback } from '@/types'
import { getCashbacks, createCashback, updateCashback } from '@/services/api'
import Layout from '@/components/shared/Layout'
import CashbackForm from './CashbackForm'

export default function CashbackFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initial, setInitial] = useState<Cashback | undefined>()
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (!id) return
    getCashbacks()
      .then(items => {
        const found = items.find(c => c.id === id)
        if (found) setInitial(found)
        else navigate('/cashbacks', { replace: true })
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  async function handleSave(data: Omit<Cashback, 'id' | 'createdAt' | 'updatedAt'>) {
    if (id) {
      await updateCashback(id, data)
    } else {
      await createCashback(data)
    }
    navigate('/cashbacks')
  }

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
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {id ? 'Edit Cashback' : 'Add Cashback'}
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
          </div>
        ) : (
          <CashbackForm
            initial={initial}
            onSave={handleSave}
            onCancel={() => navigate('/cashbacks')}
          />
        )}
      </div>
    </Layout>
  )
}
