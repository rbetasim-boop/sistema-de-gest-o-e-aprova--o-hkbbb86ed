import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useRealtime } from '@/hooks/use-realtime'
import { getRules, createRule, updateRule, deleteRule } from '@/services/approval_rules'
import { getUsers } from '@/services/users'
import { extractFieldErrors } from '@/lib/pocketbase/errors'

const CATEGORIES = ['Todos', 'Eventos', 'Serviços', 'Materiais', 'TI', 'Marketing', 'Geral']

export function ApprovalLimits() {
  const [rules, setRules] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<any | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const [formData, setFormData] = useState<any>({})

  const loadData = async () => {
    try {
      const [r, u] = await Promise.all([getRules(), getUsers()])
      setRules(r)
      setUsers(u)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('approval_rules', () => {
    loadData()
  })
  useRealtime('users', () => {
    loadData()
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const handleOpenDialog = (rule?: any) => {
    setFieldErrors({})
    if (rule) {
      setEditingRule(rule)
      setFormData({
        name: rule.name,
        category: rule.category,
        min_amount: rule.min_amount,
        max_amount: rule.max_amount,
        approver: rule.approver,
        active: rule.active,
      })
    } else {
      setEditingRule(null)
      setFormData({
        name: '',
        category: '',
        min_amount: 0,
        max_amount: 0,
        approver: '',
        active: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setFieldErrors({})

    if (formData.max_amount < formData.min_amount) {
      setFieldErrors({ max_amount: 'O valor máximo não pode ser menor que o valor mínimo.' })
      return
    }

    try {
      if (editingRule) {
        await updateRule(editingRule.id, formData)
        toast({ title: 'Sucesso', description: 'Regra atualizada com sucesso.' })
      } else {
        await createRule(formData)
        toast({ title: 'Sucesso', description: 'Regra criada com sucesso.' })
      }
      setIsDialogOpen(false)
    } catch (err) {
      const errors = extractFieldErrors(err)
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
      } else {
        toast({ title: 'Erro', description: 'Erro ao salvar a regra.', variant: 'destructive' })
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteRule(id)
      toast({ title: 'Sucesso', description: 'Regra excluída com sucesso.' })
    } catch (err) {
      toast({ title: 'Erro', description: 'Erro ao excluir a regra.', variant: 'destructive' })
    }
  }

  const toggleStatus = async (rule: any) => {
    try {
      await updateRule(rule.id, { active: !rule.active })
    } catch (err) {
      toast({ title: 'Erro', description: 'Erro ao atualizar status.', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-5 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Regras de Alçada</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure os limites de aprovação por categoria e faixas de valor.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Nova Regra
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Editar Regra' : 'Criar Nova Regra'}</DialogTitle>
            <DialogDescription>
              Defina os parâmetros de limite de valor e quem será o aprovador responsável.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Compras Menores TI"
                />
                {fieldErrors.name && (
                  <span className="text-xs text-destructive mt-1 block">{fieldErrors.name}</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.category && (
                  <span className="text-xs text-destructive mt-1 block">
                    {fieldErrors.category}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="min_amount" className="text-right">
                Valor Mín
              </Label>
              <div className="col-span-3">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-medium">
                    R$
                  </span>
                  <Input
                    id="min_amount"
                    type="number"
                    value={formData.min_amount ?? ''}
                    onChange={(e) =>
                      setFormData({ ...formData, min_amount: Number(e.target.value) })
                    }
                    className="pl-9"
                  />
                </div>
                {fieldErrors.min_amount && (
                  <span className="text-xs text-destructive mt-1 block">
                    {fieldErrors.min_amount}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max_amount" className="text-right">
                Valor Máx
              </Label>
              <div className="col-span-3">
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-medium">
                    R$
                  </span>
                  <Input
                    id="max_amount"
                    type="number"
                    value={formData.max_amount ?? ''}
                    onChange={(e) =>
                      setFormData({ ...formData, max_amount: Number(e.target.value) })
                    }
                    className="pl-9"
                  />
                </div>
                {fieldErrors.max_amount && (
                  <span className="text-xs text-destructive mt-1 block">
                    {fieldErrors.max_amount}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="approver" className="text-right">
                Aprovador
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.approver}
                  onValueChange={(val) => setFormData({ ...formData, approver: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o aprovador" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.approver && (
                  <span className="text-xs text-destructive mt-1 block">
                    {fieldErrors.approver}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar Regra</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {rules.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 rounded-xl bg-card border-dashed animate-fade-in-up">
          <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center mb-4">
            <ShieldAlert className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhuma regra definida</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-sm">
            Crie regras de alçada para controlar quem pode aprovar solicitações baseadas em faixas
            de valor.
          </p>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Nova Regra
          </Button>
        </div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden shadow-sm animate-fade-in">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[200px]">Nome da Regra</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Faixa de Valor</TableHead>
                  <TableHead>Aprovador Exigido</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium text-foreground">{rule.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {rule.category || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                      {formatCurrency(rule.min_amount)} -{' '}
                      {rule.max_amount >= 9999999 ? 'Sem limite' : formatCurrency(rule.max_amount)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary/20">
                        {users.find((u) => u.id === rule.approver)?.name || 'Desconhecido'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={rule.active} onCheckedChange={() => toggleStatus(rule)} />
                        <span className="text-sm text-muted-foreground hidden sm:inline-block">
                          {rule.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(rule)}>
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir regra de alçada?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir a regra "{rule.name}"? Esta ação não
                                pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(rule.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}
