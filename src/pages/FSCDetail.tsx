import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useFSCStore } from '@/stores/use-fsc-store'
import { formatCurrency, formatDate, getTierInfo } from '@/lib/date-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, FileText, Download } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function FSCDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getFSC, updateFSCStatus } = useFSCStore()
  const fsc = getFSC(id || '')

  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [returnModalOpen, setReturnModalOpen] = useState(false)
  const [notes, setNotes] = useState('')

  if (!fsc) {
    return <div className="p-8 text-center">FSC não encontrado.</div>
  }

  const tierInfo = getTierInfo(fsc.totalValue)

  // Define visibility of actions based on simple mock logic
  // In real app, this would check user roles
  const canApprove = fsc.status.includes('Aprovação') || fsc.status === 'Pendente Financeiro'

  const handleApprove = () => {
    let nextStatus = fsc.status
    if (fsc.status === 'Pendente Financeiro') {
      nextStatus = tierInfo.tier >= 3 ? 'Em Aprovação (Dir. Op.)' : 'Aprovado'
    } else if (fsc.status === 'Em Aprovação (Dir. Op.)') {
      nextStatus = tierInfo.tier === 4 ? 'Em Aprovação (Presidente)' : 'Aprovado'
    } else if (fsc.status === 'Em Aprovação (Presidente)') {
      nextStatus = 'Aprovado'
    }

    updateFSCStatus(fsc.id, nextStatus as any, 'Aprovador Atual')
    toast({ title: 'Aprovado', description: 'Solicitação avançou no fluxo.' })
  }

  const handleReject = () => {
    updateFSCStatus(fsc.id, 'Reprovado', 'Aprovador Atual', notes)
    setRejectModalOpen(false)
    toast({ title: 'Reprovado', variant: 'destructive', description: 'Solicitação reprovada.' })
  }

  const handleReturn = () => {
    updateFSCStatus(fsc.id, 'Devolvido', 'Aprovador Atual', notes)
    setReturnModalOpen(false)
    toast({ title: 'Devolvido', description: 'Solicitação devolvida para ajustes.' })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            FSC {fsc.fscNo}
            <StatusBadge status={fsc.status} />
          </h1>
          <p className="text-muted-foreground mt-1">
            Alçada: <strong className="text-foreground">{tierInfo.label}</strong> (Prazo:{' '}
            {tierInfo.days} dias úteis)
          </p>
        </div>

        {canApprove && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-warning text-warning hover:bg-warning/10"
              onClick={() => setReturnModalOpen(true)}
            >
              <AlertCircle className="mr-2 h-4 w-4" /> Devolver
            </Button>
            <Button
              variant="outline"
              className="border-danger text-danger hover:bg-danger/10"
              onClick={() => setRejectModalOpen(true)}
            >
              <XCircle className="mr-2 h-4 w-4" /> Reprovar
            </Button>
            <Button className="bg-success hover:bg-success/90 text-white" onClick={handleApprove}>
              <CheckCircle className="mr-2 h-4 w-4" /> Aprovar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-subtle border-transparent">
            <CardHeader className="bg-accent/30 border-b">
              <CardTitle className="text-lg">Detalhes do Evento</CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome do Evento</p>
                <p className="font-medium text-foreground">{fsc.eventName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data do Evento</p>
                <p className="font-medium text-foreground">{formatDate(fsc.eventDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Local</p>
                <p className="font-medium text-foreground">{fsc.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Centro de Custo</p>
                <p className="font-medium text-foreground">{fsc.centerOfCost}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Solicitante</p>
                <p className="font-medium text-foreground">{fsc.requester}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Público</p>
                <p className="font-medium text-foreground">{fsc.audience || '-'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-subtle border-transparent">
            <CardHeader className="bg-accent/30 border-b">
              <CardTitle className="text-lg">Itens e Serviços</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Descrição</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Unitário</TableHead>
                    <TableHead className="text-right pr-6">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fsc.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="pl-6">{item.description}</TableCell>
                      <TableCell>{item.qtd}</TableCell>
                      <TableCell>{formatCurrency(item.unitValue)}</TableCell>
                      <TableCell className="text-right pr-6 font-medium">
                        {formatCurrency(item.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50">
                    <TableCell
                      colSpan={3}
                      className="pl-6 text-right font-bold text-muted-foreground"
                    >
                      Total Geral:
                    </TableCell>
                    <TableCell className="text-right pr-6 font-bold text-lg text-primary">
                      {formatCurrency(fsc.totalValue)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-subtle border-transparent">
            <CardHeader className="bg-accent/30 border-b">
              <CardTitle className="text-lg">Orçamentos Apresentados</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {fsc.budgets.map((b, i) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-4 border rounded-md bg-accent/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">{b.provider}</p>
                      <p className="text-sm text-muted-foreground">CNPJ: {b.cnpj}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div className="font-bold">{formatCurrency(b.totalValue)}</div>
                    <Button variant="ghost" size="icon" className="text-secondary">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <Card className="shadow-subtle border-transparent">
            <CardHeader className="bg-accent/30 border-b">
              <CardTitle className="text-lg">Fluxo de Aprovação</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative pl-6 border-l-2 border-accent space-y-6">
                {fsc.history.map((evt, idx) => (
                  <div key={evt.id} className="relative">
                    <div className="absolute -left-[33px] h-4 w-4 rounded-full border-2 border-white bg-secondary"></div>
                    <p className="text-sm font-semibold">{evt.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {evt.user} • {formatDate(evt.date)}
                    </p>
                    {evt.notes && (
                      <p className="text-sm mt-2 p-2 bg-muted rounded italic text-muted-foreground">
                        "{evt.notes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {fsc.status === 'Aprovado' && (
            <Card className="shadow-subtle border-transparent bg-success/5 border-success/20">
              <CardHeader>
                <CardTitle className="text-lg text-success">Pós-Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-white border border-border text-foreground hover:bg-accent">
                  <FileText className="mr-2 h-4 w-4" /> Anexar Nota Fiscal
                </Button>
                <Button className="w-full bg-white border border-border text-foreground hover:bg-accent">
                  <FileText className="mr-2 h-4 w-4" /> Anexar Comprovante
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprovar Solicitação</DialogTitle>
            <DialogDescription>A solicitação será encerrada definitivamente.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Motivo da reprovação..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-danger hover:bg-danger/90"
              onClick={handleReject}
              disabled={!notes}
            >
              Confirmar Reprovação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={returnModalOpen} onOpenChange={setReturnModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Devolver Solicitação</DialogTitle>
            <DialogDescription>
              A solicitação retornará ao Solicitante para correções.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Descreva os ajustes necessários..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setReturnModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-warning hover:bg-warning/90 text-white"
              onClick={handleReturn}
              disabled={!notes}
            >
              Devolver para Ajuste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
