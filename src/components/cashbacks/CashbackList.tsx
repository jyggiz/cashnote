import { useCallback, useEffect, useState } from 'react'
import type { Cashback } from '@/types'
import { getCashbacks, createCashback, updateCashback, deleteCashback } from '@/services/api'
import { createCashbackSearch } from '@/utils/search'
import { useAuth } from '@/hooks/useAuth'
import Layout from '@/components/shared/Layout'
import SearchBar from '@/components/shared/SearchBar'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import CashbackCard from './CashbackCard'
import CashbackForm from './CashbackForm'

export default function CashbackList() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState<Cashback[]>([])
  const [filtered, setFiltered] = useState<Cashback[]>([])
  const [loading, setLoading] = useState(true)
  const [editTarget, setEditTarget] = useState<Cashback | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  function load() {
    setLoading(true)
    getCashbacks()
      .then(data => {
        setItems(data)
        setFiltered(data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  const handleSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setFiltered(items)
        return
      }
      const fuse = createCashbackSearch(items)
      setFiltered(fuse.search(query).map(r => r.item))
    },
    [items],
  )

  async function handleSave(data: Omit<Cashback, 'id' | 'createdAt' | 'updatedAt'>) {
    if (editTarget) {
      await updateCashback(editTarget.id, data)
    } else {
      await createCashback(data)
    }
    setShowForm(false)
    setEditTarget(null)
    load()
  }

  async function handleDelete() {
    if (!deleteId) return
    await deleteCashback(deleteId)
    setDeleteId(null)
    load()
  }

  function openEdit(cashback: Cashback) {
    setEditTarget(cashback)
    setShowForm(true)
  }

  function openAdd() {
    setEditTarget(null)
    setShowForm(true)
  }

  return (
    <Layout
      title="Cashbacks"
      headerRight={
        isAdmin ? (
          <button
            onClick={openAdd}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-700 text-white shadow"
            aria-label="Add cashback"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        ) : undefined
      }
    >
      <SearchBar placeholder="Search category, merchant, bank…" onSearch={handleSearch} />

      {loading && (
        <div className="flex justify-center pt-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 pt-16 text-center">
          <p className="text-gray-400 dark:text-gray-500">No cashbacks found.</p>
          {isAdmin && (
            <button onClick={openAdd} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-medium text-white">
              Add first cashback
            </button>
          )}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(cashback => (
          <CashbackCard
            key={cashback.id}
            cashback={cashback}
            onEdit={openEdit}
            onDelete={id => setDeleteId(id)}
          />
        ))}
      </div>

      {showForm && (
        <CashbackForm
          initial={editTarget ?? undefined}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditTarget(null) }}
        />
      )}

      {deleteId && (
        <ConfirmDialog
          message="This cashback will be permanently removed."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </Layout>
  )
}
