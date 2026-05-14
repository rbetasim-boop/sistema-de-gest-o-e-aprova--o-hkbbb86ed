import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApprovalLimits } from '@/components/settings/ApprovalLimits'
import { UserManagement } from '@/components/settings/UserManagement'

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as preferências e regras de negócio do sistema.
        </p>
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
