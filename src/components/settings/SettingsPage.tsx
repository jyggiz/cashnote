import Layout from '@/components/shared/Layout'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useNotifications } from '@/hooks/useNotifications'

export default function SettingsPage() {
  const { username, logout } = useAuth()
  const { theme, toggle: toggleTheme } = useTheme()
  const { permission, request: requestNotifications, supported } = useNotifications()

  const displayName = username ?? 'User'

  return (
    <Layout title="Settings">
      <div className="space-y-4">
        {/* User info */}
        <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
              <span className="text-lg font-semibold text-teal-700 dark:text-teal-300">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{displayName}</p>
              <span className="mt-0.5 inline-block rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-900 dark:text-teal-300">
                Admin
              </span>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl bg-white shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {theme === 'dark' ? 'On' : 'Off'}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-teal-700' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={theme === 'dark'}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl bg-white shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Notifications</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {!supported
                  ? 'Not supported'
                  : permission === 'granted'
                  ? 'Enabled'
                  : permission === 'denied'
                  ? 'Blocked in browser'
                  : 'Not enabled'}
              </p>
            </div>
            {supported && permission !== 'granted' && permission !== 'denied' && (
              <button
                onClick={requestNotifications}
                className="rounded-xl bg-teal-700 px-3 py-1.5 text-sm font-medium text-white"
              >
                Enable
              </button>
            )}
            {supported && permission === 'granted' && (
              <span className="text-sm font-medium text-teal-700 dark:text-teal-400">✓ On</span>
            )}
            {supported && permission === 'denied' && (
              <span className="text-sm text-gray-400">Check browser settings</span>
            )}
          </div>
        </div>

        {/* Sign out */}
        <button
          onClick={logout}
          className="w-full rounded-2xl bg-white py-4 text-center font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 dark:bg-gray-900 dark:hover:bg-red-950/20"
        >
          Sign Out
        </button>
      </div>
    </Layout>
  )
}
