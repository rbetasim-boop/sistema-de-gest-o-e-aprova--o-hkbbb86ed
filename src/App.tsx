import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Index from './pages/Index'
import NewFSC from './pages/NewFSC'
import FSCDetail from './pages/FSCDetail'
import MyRequests from './pages/MyRequests'
import Pending from './pages/Pending'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { FSCProvider } from './stores/use-fsc-store'
import { AuthProvider, useAuth } from './hooks/use-auth'

function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

const App = () => (
  <AuthProvider>
    <FSCProvider>
      <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/new" element={<NewFSC />} />
                <Route path="/fsc/:id" element={<FSCDetail />} />
                <Route path="/my-requests" element={<MyRequests />} />
                <Route path="/pending" element={<Pending />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </FSCProvider>
  </AuthProvider>
)

export default App
