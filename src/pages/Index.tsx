import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Clock, FileText, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/StatusBadge'
import { useRealtime } from '@/hooks/use-realtime'
import { getRequests } from '@/services/requests'

export default function Index() {
  const [fscs, setFscs] = useState<any[]>([])

  const loadData = async () => {
    try {
      const data = await getRequests()
      setFscs(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('requests', () => {
    loadData()
  })

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR')

  const totalEmAprovacao = fscs
    .filter((f) => f.status === 'pending')
    .reduce((acc, f) => acc + f.amount, 0)

  const pendentes = fscs.filter((f) => f.status === 'pending').length
  const aprovados = fscs.filter((f) => f.status === 'approved').length

  const getStatusMapped = (status: string) => {
    if (status === 'pending') return 'Pendente'
    if (status === 'approved') return 'Aprovado'
    return 'Devolvido'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das solicitações de compras de eventos.
          </p>
        </div>
        <Link to="/new">
          <Button className="bg-secondary hover:bg-secondary/90 text-white">
            Nova Solicitação
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-subtle border-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total em Aprovação
            </CardTitle>
            <FileText className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(totalEmAprovacao)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{pendentes}</div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prazo Crítico
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">0</div>
            <p className="text-xs text-muted-foreground mt-1">Menos de 48h</p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aprovados no Mês
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{aprovados}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle border-transparent">
        <CardHeader>
          <CardTitle className="text-lg">Solicitações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-accent">
            <Table>
              <TableHeader className="bg-accent">
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fscs.map((fsc) => (
                  <TableRow key={fsc.id} className="hover:bg-accent/50 transition-colors">
                    <TableCell className="font-medium text-primary uppercase">
                      {fsc.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>{fsc.title}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {fsc.expand?.requester?.name ||
                        fsc.expand?.requester?.email ||
                        'Desconhecido'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(fsc.amount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={getStatusMapped(fsc.status)} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(fsc.created)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {fsc.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 text-secondary hover:text-secondary/80"
                          >
                            <Link to={`/edit/${fsc.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="h-8 w-8 text-primary hover:text-primary/80"
                        >
                          <Link to={`/fsc/${fsc.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {fscs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma solicitação encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
