import { Badge } from '@/components/ui/badge'
import { FSCStatus } from '@/types/fsc'

export function StatusBadge({ status }: { status: FSCStatus }) {
  let colorClass = 'bg-muted text-muted-foreground'

  switch (status) {
    case 'Aprovado':
      colorClass = 'bg-success hover:bg-success/90 text-white border-transparent'
      break
    case 'Reprovado':
      colorClass = 'bg-danger hover:bg-danger/90 text-white border-transparent'
      break
    case 'Pendente Financeiro':
    case 'Em Aprovação (Dir. Op.)':
    case 'Em Aprovação (Presidente)':
      colorClass = 'bg-warning hover:bg-warning/90 text-white border-transparent'
      break
    case 'Devolvido':
      colorClass = 'bg-secondary hover:bg-secondary/90 text-white border-transparent'
      break
    case 'Rascunho':
      colorClass = 'bg-muted text-muted-foreground border-border'
      break
  }

  return <Badge className={`${colorClass} whitespace-nowrap`}>{status}</Badge>
}
