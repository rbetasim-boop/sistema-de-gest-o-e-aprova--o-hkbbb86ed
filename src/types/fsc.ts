export type FSCStatus =
  | 'Rascunho'
  | 'Pendente Financeiro'
  | 'Em Aprovação (Dir. Op.)'
  | 'Em Aprovação (Presidente)'
  | 'Aprovado'
  | 'Reprovado'
  | 'Devolvido'

export interface FSCItem {
  id: string
  description: string
  qtd: number
  unitValue: number
  total: number
}

export interface FSCBudget {
  id: string
  provider: string
  cnpj: string
  totalValue: number
  deadline: string
}

export interface FSC {
  id: string
  fscNo: string
  eventName: string
  eventDate: string
  location: string
  requester: string
  centerOfCost: string
  audience: string
  items: FSCItem[]
  budgets: FSCBudget[]
  totalValue: number
  status: FSCStatus
  createdAt: string
  deadline: string
  justification?: string
  tier: number
  history: FSCHistoryEvent[]
}

export interface FSCHistoryEvent {
  id: string
  date: string
  user: string
  action: string
  notes?: string
}
