import { useFSCStore } from '@/stores/use-fsc-store'
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
import { Eye, Edit } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/date-utils'

export default function MyRequests() {
  const { fscs } = useFSCStore()
  // Mock filter for the current user
  const myRequests = fscs.filter(
    (f) => f.requester === 'Maria Silva' || f.requester === 'Ana Costa',
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Minhas Solicitações</h1>
          <p className="text-muted-foreground">
            Acompanhe o status dos eventos solicitados por você.
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
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Limite</TableHead>
                  <TableHead className="text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myRequests.map((fsc) => (
                  <TableRow key={fsc.id}>
                    <TableCell className="pl-6 font-medium text-primary">{fsc.fscNo}</TableCell>
                    <TableCell>{fsc.eventName}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(fsc.totalValue)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={fsc.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(fsc.deadline)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        {(fsc.status === 'Rascunho' || fsc.status === 'Devolvido') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8 text-secondary"
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
                          className="h-8 w-8 text-primary"
                        >
                          <Link to={`/fsc/${fsc.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
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
