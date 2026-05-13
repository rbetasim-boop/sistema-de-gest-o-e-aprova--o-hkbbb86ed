import { useFSCStore } from '@/stores/use-fsc-store'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/date-utils'

export default function Pending() {
  const { fscs } = useFSCStore()
  // Mock filter for Finance/Director
  const pendingRequests = fscs.filter(
    (f) => f.status.includes('Pendente') || f.status.includes('Aprovação'),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Pendências de Aprovação
          </h1>
          <p className="text-muted-foreground">
            Solicitações que aguardam a sua análise e aprovação.
          </p>
        </div>
      </div>

      <Card className="shadow-subtle border-transparent">
        <CardContent className="p-0">
          <div className="rounded-md border-0">
            <Table>
              <TableHeader className="bg-accent/50">
                <TableRow>
                  <TableHead className="pl-6">FSC No.</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Solicitante</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead>Alçada</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((fsc) => (
                  <TableRow key={fsc.id} className="hover:bg-accent/30">
                    <TableCell className="pl-6 font-medium text-primary">{fsc.fscNo}</TableCell>
                    <TableCell>{fsc.eventName}</TableCell>
                    <TableCell className="text-muted-foreground">{fsc.requester}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(fsc.totalValue)}
                    </TableCell>
                    <TableCell>Nível {fsc.tier}</TableCell>
                    <TableCell>
                      <StatusBadge status={fsc.status} />
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button size="sm" asChild className="bg-secondary hover:bg-secondary/90">
                        <Link to={`/fsc/${fsc.id}`}>
                          Analise <CheckCircle2 className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
