import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { HelpfulInfo } from '@/types'
import { getHelpfulInfo } from '@/services/api'
import Layout from '@/components/shared/Layout'

export default function HelpfulDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<HelpfulInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHelpfulInfo()
      .then(items => {
        const found = items.find(i => i.id === id)
        if (found) setItem(found)
        else navigate('/helpful', { replace: true })
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

  if (!item) return null

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
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.title} className="mb-4 h-48 w-full rounded-xl object-cover" />
        )}
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{item.title}</h1>
        <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">{item.description}</p>

        {item.links && item.links.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">Links</p>
            <div className="space-y-2">
              {item.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2.5 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100 dark:bg-teal-950/30 dark:text-teal-300 dark:hover:bg-teal-950/50"
                >
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
