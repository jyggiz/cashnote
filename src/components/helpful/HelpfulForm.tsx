import { useEffect, useState } from 'react'
import type { HelpfulInfo } from '@/types'

interface HelpfulFormProps {
  initial?: HelpfulInfo
  onSave: (data: Omit<HelpfulInfo, 'id' | 'createdAt'>) => Promise<void>
  onCancel: () => void
}

type LinkEntry = { text: string; url: string }

type FormState = {
  title: string
  description: string
  links: LinkEntry[]
  imageUrl: string
}

const EMPTY: FormState = { title: '', description: '', links: [], imageUrl: '' }

export default function HelpfulForm({ initial, onSave, onCancel }: HelpfulFormProps) {
  const [form, setForm] = useState<FormState>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        description: initial.description,
        links: initial.links ? [...initial.links] : [],
        imageUrl: initial.imageUrl ?? '',
      })
    }
  }, [initial])

  function addLink() {
    setForm(f => ({ ...f, links: [...f.links, { text: '', url: '' }] }))
  }

  function updateLink(idx: number, field: keyof LinkEntry, value: string) {
    setForm(f => {
      const links = [...f.links]
      links[idx] = { ...links[idx], [field]: value }
      return { ...f, links }
    })
  }

  function removeLink(idx: number) {
    setForm(f => ({ ...f, links: f.links.filter((_, i) => i !== idx) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.description) {
      setError('Please fill in title and description.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const validLinks = form.links.filter(l => l.text && l.url)
      await onSave({
        title: form.title,
        description: form.description,
        links: validLinks.length > 0 ? validLinks : undefined,
        imageUrl: form.imageUrl || undefined,
      })
    } catch {
      setError('Failed to save. Please try again.')
      setSaving(false)
    }
  }

  const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
  const labelCls = 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Title *</label>
          <input className={inputCls} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. How to maximize cashback" />
        </div>

        <div>
          <label className={labelCls}>Description *</label>
          <textarea rows={5} className={inputCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Detailed information…" />
        </div>

        <div>
          <label className={labelCls}>Image URL</label>
          <input className={inputCls} value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://…" />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className={labelCls + ' mb-0'}>Links</label>
            <button type="button" onClick={addLink} className="text-sm font-medium text-teal-700 dark:text-teal-400">+ Add Link</button>
          </div>
          {form.links.map((link, i) => (
            <div key={i} className="mb-2 flex gap-2">
              <input className={inputCls} value={link.text} onChange={e => updateLink(i, 'text', e.target.value)} placeholder="Label" />
              <input className={inputCls} value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder="https://…" />
              <button type="button" onClick={() => removeLink(i)} className="shrink-0 text-gray-400 hover:text-red-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="mt-5 flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-teal-700 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}
