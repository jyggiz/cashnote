import { Link, useNavigate } from 'react-router-dom'
import type { HelpfulInfo } from '@/types'
import { useAuth } from '@/hooks/useAuth'

interface HelpfulCardProps {
  item: HelpfulInfo
  onDelete: (id: string) => void
}

export default function HelpfulCard({ item, onDelete }: HelpfulCardProps) {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  return (
    <div className="rounded-2xl bg-white shadow-sm dark:bg-gray-900">
      <Link to={`/helpful/${item.id}`} className="block p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.title} className="mb-3 h-32 w-full rounded-xl object-cover" />
            )}
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</h2>
            <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
            {item.links && item.links.length > 0 && (
              <p className="mt-1.5 text-xs text-teal-600 dark:text-teal-400">
                {item.links.length} link{item.links.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {isAdmin && (
            <div className="flex gap-1 shrink-0" onClick={e => e.preventDefault()}>
              <button onClick={() => navigate(`/helpful/${item.id}/edit`)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800" aria-label="Edit">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button onClick={() => onDelete(item.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20" aria-label="Delete">
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
