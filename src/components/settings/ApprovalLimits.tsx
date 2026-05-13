import { useState } from 'react'
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

type Rule = {
  id: string
  name: string
  category: string
  min: number
  max: number
  approver: string
  active: boolean
}

const CATEGORIES = ['Todos', 'Eventos', 'Serviços', 'Materiais', 'TI', 'Marketing']
const ROLES = ['Gerente de Departamento', 'Diretor', 'CFO', 'CEO', 'Financeiro']

export function ApprovalLimits() {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      name: 'Compras Menores TI',
      category: 'TI',
      min: 0,
      max: 5000,
      approver: 'Gerente de Departamento',
      active: true,
    },
    {
      id: '2',
      name: 'Serviços Especializados',
      category: 'Serviços',
      min: 5001,
      max: 50000,
      approver: 'Diretor',
      active: true,
    },
    {
      id: '3',
      name: 'Grandes Eventos',
      category: 'Eventos',
      min: 50001,
      max: 9999999,
      approver: 'CFO',
      active: false,
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<Partial<Rule>>({})

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const handleOpenDialog = (rule?: Rule) => {
    if (rule) {
      setEditingRule(rule)
      setFormData(rule)
    } else {
      setEditingRule(null)
      setFormData({
        name: '',
        category: '',
        min: 0,
        max: 0,
        approver: '',
        active: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.category ||
      formData.min === undefined ||
      formData.max === undefined ||
      !formData.approver
    ) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    if (formData.max < formData.min) {
      toast({
        title: 'Erro',
        description: 'O valor máximo não pode ser menor que o valor mínimo.',
        variant: 'destructive',
      })
      return
    }

    if (editingRule) {
      setRules(
        rules.map((r) => (r.id === editingRule.id ? ({ ...formData, id: r.id } as Rule) : r)),
      )
      toast({ title: 'Sucesso', description: 'Regra atualizada com sucesso.' })
    } else {
      setRules([...rules, { ...formData, id: Math.random().toString(36).substr(2, 9) } as Rule])
      toast({ title: 'Sucesso', description: 'Regra criada com sucesso.' })
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setRules(rules.filter((r) => r.id !== id))
    toast({ title: 'Sucesso', description: 'Regra excluída com sucesso.' })
  }

  const toggleStatus = (id: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, active: !r.active } : r)))
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
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
                placeholder="Ex: Compras Menores TI"
              />
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
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="min" className="text-right">
                Valor Mín
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-medium">
                  R$
                </span>
                <Input
                  id="min"
                  type="number"
                  value={formData.min ?? ''}
                  onChange={(e) => setFormData({ ...formData, min: Number(e.target.value) })}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max" className="text-right">
                Valor Máx
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-medium">
                  R$
                </span>
                <Input
                  id="max"
                  type="number"
                  value={formData.max ?? ''}
                  onChange={(e) => setFormData({ ...formData, max: Number(e.target.value) })}
                  className="pl-9"
                />
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
                    <SelectValue placeholder="Selecione o aprovador responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            Crie regras de alçada para controlar quem pode aprovar solicitações de compra e
            contratações baseadas em faixas de valor.
          </p>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add New Rule
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
                        {rule.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap text-sm">
                      {formatCurrency(rule.min)} -{' '}
                      {rule.max >= 9999999 ? 'Sem limite' : formatCurrency(rule.max)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary/20">
                        {rule.approver}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.active}
                          onCheckedChange={() => toggleStatus(rule.id)}
                        />
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
