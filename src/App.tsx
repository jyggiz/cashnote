import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import LoginPage from '@/components/auth/LoginPage'
import SettingsPage from '@/components/settings/SettingsPage'
import CashbackList from '@/components/cashbacks/CashbackList'
import CashbackDetail from '@/components/cashbacks/CashbackDetail'
import CashbackFormPage from '@/components/cashbacks/CashbackFormPage'
import PromocodeList from '@/components/promocodes/PromocodeList'
import PromocodeDetail from '@/components/promocodes/PromocodeDetail'
import PromocodeFormPage from '@/components/promocodes/PromocodeFormPage'
import HelpfulList from '@/components/helpful/HelpfulList'
import HelpfulDetail from '@/components/helpful/HelpfulDetail'
import HelpfulFormPage from '@/components/helpful/HelpfulFormPage'
import { useAuth } from '@/hooks/useAuth'

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-700 border-t-transparent" />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { username, isLoading } = useAuth()
  if (isLoading) return <Spinner />
  if (!username) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/cashbacks"
        element={
          <ProtectedRoute>
            <CashbackList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cashbacks/new"
        element={
          <ProtectedRoute>
            <CashbackFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cashbacks/:id/edit"
        element={
          <ProtectedRoute>
            <CashbackFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cashbacks/:id"
        element={
          <ProtectedRoute>
            <CashbackDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/promocodes"
        element={
          <ProtectedRoute>
            <PromocodeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/promocodes/new"
        element={
          <ProtectedRoute>
            <PromocodeFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/promocodes/:id/edit"
        element={
          <ProtectedRoute>
            <PromocodeFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/promocodes/:id"
        element={
          <ProtectedRoute>
            <PromocodeDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/helpful"
        element={
          <ProtectedRoute>
            <HelpfulList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/helpful/new"
        element={
          <ProtectedRoute>
            <HelpfulFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/helpful/:id/edit"
        element={
          <ProtectedRoute>
            <HelpfulFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/helpful/:id"
        element={
          <ProtectedRoute>
            <HelpfulDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/cashbacks" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
