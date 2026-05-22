import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import EditExpensePage from './pages/EditExpensePage'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import ProtectedRoute from './routes/ProtectedRoute'

const RootRedirect = () => {
  const { token, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <span className="text-sm tracking-[0.3em] uppercase">
          Loading
        </span>
      </div>
    )
  }
  return <Navigate to={token ? '/dashboard' : '/login'} replace />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'expense/:id/edit', element: <EditExpensePage /> },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
