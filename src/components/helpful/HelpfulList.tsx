import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { HelpfulInfo } from '@/types'
import { getHelpfulInfo, deleteHelpfulInfo } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'
import Layout from '@/components/shared/Layout'
import SearchBar from '@/components/shared/SearchBar'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import HelpfulCard from './HelpfulCard'
import { createHelpfulInfoSearch } from '@/utils/search'

export default function HelpfulList() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState<HelpfulInfo[]>([])
  const [filtered, setFiltered] = useState<HelpfulInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function load() {
    setLoading(true)
    getHelpfulInfo()
      .then(data => { setItems(data); setFiltered(data) })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) { setFiltered(items); return }
    setFiltered(createHelpfulInfoSearch(items).search(query).map(r => r.item))
  }, [items])

  async function handleDelete() {
    if (!deleteId) return
    await deleteHelpfulInfo(deleteId)
    setDeleteId(null)
    load()
  }

  return (
    <Layout
      title="Helpful Info"
      headerRight={
        isAdmin ? (
          <button
            onClick={() => navigate('/helpful/new')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 text-white shadow"
            aria-label="Add info"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        ) : undefined
      }
    >
      <SearchBar placeholder="Search by title or content…" onSearch={handleSearch} />

      {loading && <div className="flex justify-center pt-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" /></div>}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 pt-16 text-center">
          <p className="text-gray-400 dark:text-gray-500">No info found.</p>
          {isAdmin && <button onClick={() => navigate('/helpful/new')} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-medium text-white">Add first article</button>}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(item => (
          <HelpfulCard
            key={item.id}
            item={item}
            onDelete={id => setDeleteId(id)}
          />
        ))}
      </div>

      {deleteId && (
        <ConfirmDialog
          message="This article will be permanently removed."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </Layout>
  )
}
