import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { HelpfulInfo } from '@/types'
import { getHelpfulInfo, createHelpfulInfo, updateHelpfulInfo } from '@/services/api'
import Layout from '@/components/shared/Layout'
import HelpfulForm from './HelpfulForm'

export default function HelpfulFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [initial, setInitial] = useState<HelpfulInfo | undefined>()
  const [loading, setLoading] = useState(!!id)

  useEffect(() => {
    if (!id) return
    getHelpfulInfo()
      .then(items => {
        const found = items.find(h => h.id === id)
        if (found) setInitial(found)
        else navigate('/helpful', { replace: true })
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  async function handleSave(data: Omit<HelpfulInfo, 'id' | 'createdAt'>) {
    if (id) {
      await updateHelpfulInfo(id, data)
    } else {
      await createHelpfulInfo(data)
    }
    navigate('/helpful')
  }

  return (
    <Layout>
      <button
        onClick={() => navigate('/helpful')}
        className="mb-4 flex items-center gap-1 text-sm font-medium text-teal-700 dark:text-teal-400"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Helpful Info
      </button>

      <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-gray-900">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {id ? 'Edit Info' : 'Add Info'}
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
          </div>
        ) : (
          <HelpfulForm
            initial={initial}
            onSave={handleSave}
            onCancel={() => navigate('/helpful')}
          />
        )}
      </div>
    </Layout>
  )
}
