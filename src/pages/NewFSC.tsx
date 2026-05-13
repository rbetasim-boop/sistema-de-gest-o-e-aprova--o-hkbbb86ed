import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFSCStore } from '@/stores/use-fsc-store'
import { getTierInfo, formatCurrency } from '@/lib/date-utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Trash2, UploadCloud, ChevronRight, Check } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Separator } from '@/components/ui/separator'

export default function NewFSC() {
  const navigate = useNavigate()
  const { addFSC } = useFSCStore()
  const [step, setStep] = useState(1)

  // Form State
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    location: '',
    requester: 'Maria Silva',
    centerOfCost: '',
    audience: '',
    justification: '',
  })

  const [items, setItems] = useState([{ id: '1', description: '', qtd: 1, unitValue: 0, total: 0 }])
  const [budgets, setBudgets] = useState([
    { id: '1', provider: '', cnpj: '', totalValue: 0, deadline: '' },
  ])

  const totalValue = useMemo(() => items.reduce((acc, item) => acc + item.total, 0), [items])
  const tierInfo = useMemo(() => getTierInfo(totalValue), [totalValue])

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === 'qtd' || field === 'unitValue') {
      newItems[index].total = Number(newItems[index].qtd) * Number(newItems[index].unitValue)
    }
    setItems(newItems)
  }

  const addItem = () =>
    setItems([
      ...items,
      { id: Math.random().toString(), description: '', qtd: 1, unitValue: 0, total: 0 },
    ])
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index))

  const handleBudgetChange = (index: number, field: string, value: string | number) => {
    const newBudgets = [...budgets]
    newBudgets[index] = { ...newBudgets[index], [field]: value }
    setBudgets(newBudgets)
  }

  const addBudget = () =>
    setBudgets([
      ...budgets,
      { id: Math.random().toString(), provider: '', cnpj: '', totalValue: 0, deadline: '' },
    ])
  const removeBudget = (index: number) => setBudgets(budgets.filter((_, i) => i !== index))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.eventName || totalValue === 0) {
      toast({
        title: 'Erro',
        description: 'Preencha os dados básicos e adicione itens.',
        variant: 'destructive',
      })
      return
    }

    if (tierInfo.budgets === 3 && budgets.length < 3) {
      toast({
        title: 'Atenção',
        description: 'São necessários 3 orçamentos para esta alçada de valor.',
        variant: 'destructive',
      })
      return
    }

    addFSC({
      ...formData,
      items,
      budgets,
      status: 'Pendente Financeiro',
    })

    toast({ title: 'Sucesso', description: 'Solicitação criada com sucesso!' })
    navigate('/')
  }

  const steps = [
    { title: 'Identificação', num: 1 },
    { title: 'Itens e Serviços', num: 2 },
    { title: 'Orçamentos', num: 3 },
    { title: 'Anexos', num: 4 },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Nova Solicitação de Compra</h1>
        <p className="text-muted-foreground">
          Preencha o formulário FSC para iniciar o processo de aprovação.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-accent -z-10 rounded-full"></div>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-secondary -z-10 rounded-full transition-all duration-300"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>

        {steps.map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-accent/50 p-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${step >= s.num ? 'bg-secondary border-secondary text-white' : 'bg-white border-muted-foreground text-muted-foreground'}`}
            >
              {step > s.num ? <Check className="w-4 h-4" /> : s.num}
            </div>
            <span
              className={`text-xs font-medium ${step >= s.num ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="shadow-subtle border-transparent mb-6 animate-fade-in">
          <CardHeader>
            <CardTitle>{steps[step - 1].title}</CardTitle>
            <CardDescription>
              {step === 1 && 'Informações gerais sobre o evento.'}
              {step === 2 && 'Liste todos os itens, serviços e quantidades necessárias.'}
              {step === 3 &&
                `Alçada atual: ${tierInfo.label} (Exige ${tierInfo.budgets} orçamento${tierInfo.budgets > 1 ? 's' : ''})`}
              {step === 4 && 'Documentação comprobatória.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nome do Evento</Label>
                  <Input
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data do Evento</Label>
                  <Input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Local do Evento</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Público Esperado</Label>
                  <Input
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Centro de Custo</Label>
                  <Input
                    value={formData.centerOfCost}
                    onChange={(e) => setFormData({ ...formData, centerOfCost: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="w-24">Qtd</TableHead>
                      <TableHead className="w-40">Valor Unit. (R$)</TableHead>
                      <TableHead className="w-40">Total</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, idx) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.qtd}
                            onChange={(e) => handleItemChange(idx, 'qtd', Number(e.target.value))}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitValue || ''}
                            onChange={(e) =>
                              handleItemChange(idx, 'unitValue', Number(e.target.value))
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium text-right">
                          {formatCurrency(item.total)}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(idx)}
                            className="text-danger hover:text-danger/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                    className="text-secondary border-secondary/20 hover:bg-secondary/10"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Item
                  </Button>
                  <div className="text-xl font-bold">
                    Total Geral:{' '}
                    <span className="text-secondary">{formatCurrency(totalValue)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-blue-50 text-blue-900 p-4 rounded-md border border-blue-100 mb-6">
                  De acordo com a alçada do valor total ({formatCurrency(totalValue)}), você precisa
                  apresentar{' '}
                  <strong>
                    {tierInfo.budgets} orçamento{tierInfo.budgets > 1 ? 's' : ''}
                  </strong>
                  .
                </div>

                {budgets.map((budget, idx) => (
                  <div key={budget.id} className="border rounded-md p-4 relative bg-accent/30">
                    {budgets.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBudget(idx)}
                        className="absolute right-2 top-2 text-danger hover:bg-danger/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <h4 className="font-medium mb-4">{idx + 1}º Orçamento</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fornecedor</Label>
                        <Input
                          value={budget.provider}
                          onChange={(e) => handleBudgetChange(idx, 'provider', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>CNPJ</Label>
                        <Input
                          value={budget.cnpj}
                          onChange={(e) => handleBudgetChange(idx, 'cnpj', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Valor Total (R$)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={budget.totalValue || ''}
                          onChange={(e) =>
                            handleBudgetChange(idx, 'totalValue', Number(e.target.value))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Anexo (PDF/Imagem)</Label>
                        <div className="flex items-center gap-2">
                          <Input type="file" className="cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {budgets.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addBudget}
                    className="w-full border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Outro Orçamento
                  </Button>
                )}

                <Separator className="my-6" />

                <div className="space-y-2">
                  <Label className="font-bold">Justificativa da Escolha</Label>
                  <p className="text-sm text-muted-foreground">
                    Obrigatória quando o fornecedor escolhido não for o de menor preço.
                  </p>
                  <Textarea
                    rows={4}
                    placeholder="Justifique a escolha do fornecedor..."
                    value={formData.justification}
                    onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6">
                {tierInfo.tier >= 3 ? (
                  <div className="border border-warning bg-warning/5 rounded-md p-6 text-center space-y-4">
                    <UploadCloud className="h-10 w-10 text-warning mx-auto" />
                    <div>
                      <h4 className="font-semibold">Upload Obrigatório: Memória de Cálculo</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Exigido para solicitações acima de R$ 15.000.
                      </p>
                    </div>
                    <Input type="file" className="max-w-xs mx-auto" />
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma documentação extra obrigatória para esta alçada.
                  </div>
                )}

                {tierInfo.tier >= 4 && (
                  <div className="border border-danger bg-danger/5 rounded-md p-6 text-center space-y-4">
                    <UploadCloud className="h-10 w-10 text-danger mx-auto" />
                    <div>
                      <h4 className="font-semibold">Upload Obrigatório: Briefing do Evento</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Exigido para solicitações acima de R$ 30.000.
                      </p>
                    </div>
                    <Input type="file" className="max-w-xs mx-auto" />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Voltar
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-secondary hover:bg-secondary/90"
            >
              Próximo <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button type="submit" className="bg-success hover:bg-success/90">
              Enviar Solicitação
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
