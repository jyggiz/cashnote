import { useEffect, useState } from 'react'
import type { Cashback } from '@/types'

interface CashbackFormProps {
  initial?: Cashback
  onSave: (data: Omit<Cashback, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void
}

type FormState = {
  category: string
  cashbackPercent: number
  merchants: string[]
  bankName: string
  cardOwner: 'timur' | 'dinara'
  expiryDate: string
  additionalInfo: string
  isUniversal: boolean
}

const EMPTY: FormState = {
  category: '',
  cashbackPercent: 5,
  merchants: [],
  bankName: '',
  cardOwner: 'timur',
  expiryDate: '',
  additionalInfo: '',
  isUniversal: false,
}

export default function CashbackForm({ initial, onSave, onCancel }: CashbackFormProps) {
  const [form, setForm] = useState<FormState>({ ...EMPTY })
  const [merchantInput, setMerchantInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initial) {
      setForm({
        category: initial.category,
        cashbackPercent: initial.cashbackPercent,
        merchants: initial.merchants,
        bankName: initial.bankName,
        cardOwner: initial.cardOwner,
        expiryDate: initial.expiryDate,
        additionalInfo: initial.additionalInfo ?? '',
        isUniversal: initial.isUniversal ?? false,
      })
    }
  }, [initial])

  function addMerchant() {
    const trimmed = merchantInput.trim()
    if (trimmed && !form.merchants.includes(trimmed)) {
      setForm(f => ({ ...f, merchants: [...f.merchants, trimmed] }))
    }
    setMerchantInput('')
  }

  function removeMerchant(m: string) {
    setForm(f => ({ ...f, merchants: f.merchants.filter(x => x !== m) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.category || !form.bankName || !form.expiryDate) {
      setError('Please fill in all required fields.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({
        category: form.category,
        cashbackPercent: form.cashbackPercent,
        merchants: form.merchants,
        bankName: form.bankName,
        cardOwner: form.cardOwner,
        expiryDate: form.expiryDate,
        additionalInfo: form.additionalInfo || undefined,
        isUniversal: form.isUniversal || undefined,
      })
    } catch {
      setError('Failed to save. Please try again.')
      setSaving(false)
    }
  }

  const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
  const labelCls = 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Category *</label>
          <input className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Kids Products" />
        </div>

        <div>
          <label className={labelCls}>Cashback % *</label>
          <input type="number" min="0" max="100" step="0.5" className={inputCls} value={form.cashbackPercent} onChange={e => setForm(f => ({ ...f, cashbackPercent: parseFloat(e.target.value) || 0 }))} />
        </div>

        <div>
          <label className={labelCls}>Bank Name *</label>
          <input className={inputCls} value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))} placeholder="e.g. Kaspi" />
        </div>

        <div>
          <label className={labelCls}>Card Owner *</label>
          <div className="flex gap-3">
            {(['timur', 'dinara'] as const).map(owner => (
              <label key={owner} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cardOwner"
                  value={owner}
                  checked={form.cardOwner === owner}
                  onChange={() => setForm(f => ({ ...f, cardOwner: owner }))}
                  className="accent-teal-700"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{owner}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>Expiry Date *</label>
          <input type="date" className={inputCls} value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} />
        </div>

        <div>
          <label className={labelCls}>Merchants</label>
          <div className="flex gap-2">
            <input
              className={inputCls}
              value={merchantInput}
              onChange={e => setMerchantInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMerchant() } }}
              placeholder="Add merchant and press Enter"
            />
            <button type="button" onClick={addMerchant} className="rounded-xl bg-teal-700 px-3 text-white text-sm">Add</button>
          </div>
          {form.merchants.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {form.merchants.map(m => (
                <span key={m} className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-sm dark:bg-gray-800">
                  {m}
                  <button type="button" onClick={() => removeMerchant(m)} className="text-gray-400 hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-gray-200 px-3 py-2.5 dark:border-gray-700">
          <input
            type="checkbox"
            checked={form.isUniversal}
            onChange={e => setForm(f => ({ ...f, isUniversal: e.target.checked }))}
            className="h-4 w-4 accent-teal-700"
          />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Applies everywhere</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Always shown in search results</p>
          </div>
        </label>

        <div>
          <label className={labelCls}>Additional Info</label>
          <textarea rows={3} className={inputCls} value={form.additionalInfo} onChange={e => setForm(f => ({ ...f, additionalInfo: e.target.value }))} placeholder="Optional notes…" />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="mt-5 flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-teal-700 py-2.5 text-sm font-medium text-white disabled:opacity-60">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}
