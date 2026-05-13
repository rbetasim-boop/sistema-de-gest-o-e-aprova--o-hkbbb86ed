import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  Bell,
  Search,
  User,
  LayoutDashboard,
  PlusCircle,
  List,
  Clock,
  Settings,
  Menu,
} from 'lucide-react'
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const location = useLocation()

  const navItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { title: 'Nova Solicitação', icon: PlusCircle, path: '/new' },
    { title: 'Minhas Solicitações', icon: List, path: '/my-requests' },
    { title: 'Pendências de Aprovação', icon: Clock, path: '/pending' },
    { title: 'Configurações', icon: Settings, path: '/settings' },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-accent">
        <Sidebar className="border-r-0">
          <SidebarHeader className="p-4 flex items-center justify-center pt-6 pb-6">
            <div className="flex items-center gap-2 font-bold text-xl text-sidebar-primary-foreground tracking-tight">
              <div className="h-8 w-8 bg-secondary rounded-lg flex items-center justify-center text-white">
                ICC
              </div>
              Sistema de Compras
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="px-2 gap-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    className="data-[active=true]:bg-secondary data-[active=true]:text-white hover:bg-sidebar-accent hover:text-white transition-colors"
                  >
                    <Link
                      to={item.path}
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm shrink-0">
            <div className="flex items-center gap-4 flex-1">
              <SidebarTrigger className="md:hidden" />
              <div className="relative w-64 max-w-sm hidden sm:flex">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número FSC..."
                  className="pl-8 bg-accent/50 border-transparent focus-visible:ring-secondary"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-danger rounded-full" />
              </Button>

              <div className="flex items-center gap-3 border-l pl-4">
                <div className="hidden md:flex flex-col items-end text-sm">
                  <span className="font-semibold text-foreground leading-none">Maria Silva</span>
                  <span className="text-xs text-muted-foreground mt-1">Time de Eventos</span>
                </div>
                <Avatar className="h-9 w-9 border">
                  <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1" />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6 md:p-8 animate-fade-in">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
