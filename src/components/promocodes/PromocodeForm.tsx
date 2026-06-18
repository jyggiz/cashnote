import { useEffect, useState } from 'react'
import type { Promocode } from '@/types'

interface PromocodeFormProps {
  initial?: Promocode
  onSave: (data: Omit<Promocode, 'id' | 'createdAt'>) => Promise<void>
  onCancel: () => void
}

const USAGE_OPTIONS = [
  { value: 'first_order', label: 'First order only' },
  { value: 'second_order', label: 'Second order only' },
  { value: 'unlimited', label: 'Unlimited' },
  { value: 'custom', label: 'Custom…' },
]

type FormState = {
  merchantName: string
  discountType: 'percent' | 'fixed'
  discountValue: number
  currency: string
  expiryDate: string
  usageType: 'first_order' | 'second_order' | 'unlimited' | 'custom'
  usageText: string
  description: string
  code: string
}

const EMPTY: FormState = {
  merchantName: '',
  discountType: 'percent',
  discountValue: 10,
  currency: 'KZT',
  expiryDate: '',
  usageType: 'unlimited',
  usageText: 'Unlimited',
  description: '',
  code: '',
}

const USAGE_LABELS: Record<string, string> = {
  first_order: 'First order only',
  second_order: 'Second order only',
  unlimited: 'Unlimited',
}

export default function PromocodeForm({ initial, onSave, onCancel }: PromocodeFormProps) {
  const [form, setForm] = useState<FormState>({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initial) {
      setForm({
        merchantName: initial.merchantName,
        discountType: initial.discountType,
        discountValue: initial.discountValue,
        currency: initial.currency ?? 'KZT',
        expiryDate: initial.expiryDate ?? '',
        usageType: initial.usageType,
        usageText: initial.usageText,
        description: initial.description ?? '',
        code: initial.code,
      })
    }
  }, [initial])

  function handleUsageType(type: FormState['usageType']) {
    const autoText = USAGE_LABELS[type] ?? ''
    setForm(f => ({ ...f, usageType: type, usageText: autoText }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.merchantName || !form.code || !form.usageText) {
      setError('Please fill in all required fields.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave({
        merchantName: form.merchantName,
        discountType: form.discountType,
        discountValue: form.discountValue,
        currency: form.discountType === 'fixed' ? form.currency : undefined,
        expiryDate: form.expiryDate || undefined,
        usageType: form.usageType,
        usageText: form.usageText,
        description: form.description || undefined,
        code: form.code,
      })
    } catch {
      setError('Failed to save. Please try again.')
      setSaving(false)
    }
  }

  const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'
  const labelCls = 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-xl dark:bg-gray-900 sm:rounded-2xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {initial ? 'Edit Promocode' : 'Add Promocode'}
        </h2>

        <div className="space-y-3">
          <div>
            <label className={labelCls}>Merchant / Shop *</label>
            <input className={inputCls} value={form.merchantName} onChange={e => setForm(f => ({ ...f, merchantName: e.target.value }))} placeholder="e.g. Amazon" />
          </div>

          <div>
            <label className={labelCls}>Discount Type *</label>
            <div className="flex gap-3">
              {(['percent', 'fixed'] as const).map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="discountType" value={t} checked={form.discountType === t} onChange={() => setForm(f => ({ ...f, discountType: t }))} className="accent-teal-700" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{t === 'percent' ? 'Percent (%)' : 'Fixed amount'}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className={labelCls}>Value *</label>
              <input type="number" min="0" step="any" className={inputCls} value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: parseFloat(e.target.value) || 0 }))} />
            </div>
            {form.discountType === 'fixed' && (
              <div className="w-28">
                <label className={labelCls}>Currency</label>
                <select className={inputCls} value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                  <option>KZT</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>RUB</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>Promo Code *</label>
            <input className={`${inputCls} font-mono uppercase tracking-widest`} value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="SAVE10" />
          </div>

          <div>
            <label className={labelCls}>Usage *</label>
            <select className={inputCls} value={form.usageType} onChange={e => handleUsageType(e.target.value as FormState['usageType'])}>
              {USAGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {form.usageType === 'custom' && (
            <div>
              <label className={labelCls}>Usage Description *</label>
              <input className={inputCls} value={form.usageText} onChange={e => setForm(f => ({ ...f, usageText: e.target.value }))} placeholder="e.g. First 3 orders" />
            </div>
          )}

          <div>
            <label className={labelCls}>Expiry Date</label>
            <input type="date" className={inputCls} value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} className={inputCls} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional details…" />
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
    </div>
  )
}
