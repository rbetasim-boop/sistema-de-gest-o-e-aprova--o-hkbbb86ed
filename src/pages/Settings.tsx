import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApprovalLimits } from '@/components/settings/ApprovalLimits'
import { UserManagement } from '@/components/settings/UserManagement'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function Settings() {
  const { signOut } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as preferências e regras de negócio do sistema.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={signOut}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sair da Conta
        </Button>
      </div>

      <Tabs defaultValue="alcadas" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="alcadas">Gestão de Alçadas</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
        </TabsList>
        <TabsContent value="geral" className="p-8 border rounded-xl bg-card shadow-sm text-center">
          <h3 className="text-lg font-medium">Configurações Gerais</h3>
          <p className="text-sm text-muted-foreground mt-2">Em desenvolvimento.</p>
        </TabsContent>
        <TabsContent value="alcadas" className="m-0">
          <ApprovalLimits />
        </TabsContent>
        <TabsContent value="usuarios" className="m-0">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
