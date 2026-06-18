import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Promocode } from '@/types'
import { getPromocodes, createPromocode, updatePromocode } from '@/services/api'
import Layout from '@/components/shared/Layout'
import PromocodeForm from './PromocodeForm'

export default function PromocodeFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initial, setInitial] = useState<Promocode | undefined>()
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (!id) return
    getPromocodes()
      .then(items => {
        const found = items.find(p => p.id === id)
        if (found) setInitial(found)
        else navigate('/promocodes', { replace: true })
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  async function handleSave(data: Omit<Promocode, 'id' | 'createdAt'>) {
    if (id) {
      await updatePromocode(id, data)
    } else {
      await createPromocode(data)
    }
    navigate('/promocodes')
  }

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
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {id ? 'Edit Promocode' : 'Add Promocode'}
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
          </div>
        ) : (
          <PromocodeForm
            initial={initial}
            onSave={handleSave}
            onCancel={() => navigate('/promocodes')}
          />
        )}
      </div>
    </Layout>
  )
}
