import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import { FSCProvider } from './stores/use-fsc-store'

const App = () => (
  <FSCProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/new" element={<NewFSC />} />
            <Route path="/fsc/:id" element={<FSCDetail />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/pending" element={<Pending />} />
            <Route
              path="/settings"
              element={<div className="p-8">Configurações (Em desenvolvimento)</div>}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </FSCProvider>
)

export default App
