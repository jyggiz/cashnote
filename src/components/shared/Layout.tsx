import BottomNav from './BottomNav'

interface LayoutProps {
  title?: string
  children: React.ReactNode
  headerRight?: React.ReactNode
}

export default function Layout({ title, children, headerRight }: LayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
      {title && (
        <header className="shrink-0 border-b border-gray-200 bg-white safe-top dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
            {headerRight}
          </div>
        </header>
      )}
      <main className="mx-auto w-full max-w-lg flex-1 overflow-y-auto px-4 pb-32 pt-4">{children}</main>
      <BottomNav />
    </div>
  )
}
