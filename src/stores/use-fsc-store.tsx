import React, { createContext, useContext, useState, ReactNode } from 'react'
import { FSC, FSCStatus } from '@/types/fsc'
import { getTierInfo, addBusinessDays } from '@/lib/date-utils'

interface FSCContextType {
  fscs: FSC[]
  addFSC: (fsc: Partial<FSC>) => void
  updateFSCStatus: (id: string, status: FSCStatus, user: string, notes?: string) => void
  getFSC: (id: string) => FSC | undefined
}

const mockData: FSC[] = [
  {
    id: '1',
    fscNo: '001/2026',
    eventName: 'Congresso Anual ICC',
    eventDate: '2026-08-15',
    location: 'Centro de Convenções SP',
    requester: 'Maria Silva',
    centerOfCost: 'Eventos Externos',
    audience: '500 pessoas',
    items: [{ id: 'i1', description: 'Locação Auditório', qtd: 1, unitValue: 35000, total: 35000 }],
    budgets: [
      {
        id: 'b1',
        provider: 'Eventos Premium',
        cnpj: '11.111.111/0001-11',
        totalValue: 35000,
        deadline: '2026-06-01',
      },
      {
        id: 'b2',
        provider: 'Espaço Alpha',
        cnpj: '22.222.222/0001-22',
        totalValue: 38000,
        deadline: '2026-06-01',
      },
      {
        id: 'b3',
        provider: 'Centro Beta',
        cnpj: '33.333.333/0001-33',
        totalValue: 40000,
        deadline: '2026-06-01',
      },
    ],
    totalValue: 35000,
    status: 'Em Aprovação (Presidente)',
    createdAt: new Date().toISOString(),
    deadline: addBusinessDays(new Date(), 15).toISOString(),
    tier: 4,
    history: [
      {
        id: 'h1',
        date: new Date().toISOString(),
        user: 'Maria Silva',
        action: 'Solicitação Criada',
      },
      {
        id: 'h2',
        date: new Date().toISOString(),
        user: 'João Financeiro',
        action: 'Aprovado pelo Financeiro',
      },
      {
        id: 'h3',
        date: new Date().toISOString(),
        user: 'Carlos Diretor',
        action: 'Aprovado pela Diretoria Operacional',
      },
    ],
  },
  {
    id: '2',
    fscNo: '002/2026',
    eventName: 'Workshop Contábil',
    eventDate: '2026-06-20',
    location: 'Sede ICC',
    requester: 'Ana Costa',
    centerOfCost: 'Treinamento',
    audience: '50 pessoas',
    items: [{ id: 'i1', description: 'Coffee Break', qtd: 50, unitValue: 60, total: 3000 }],
    budgets: [
      {
        id: 'b1',
        provider: 'Buffet Sabor',
        cnpj: '44.444.444/0001-44',
        totalValue: 3000,
        deadline: '2026-06-10',
      },
    ],
    totalValue: 3000,
    status: 'Pendente Financeiro',
    createdAt: new Date().toISOString(),
    deadline: addBusinessDays(new Date(), 5).toISOString(),
    tier: 1,
    history: [
      { id: 'h1', date: new Date().toISOString(), user: 'Ana Costa', action: 'Solicitação Criada' },
    ],
  },
]

const FSCContext = createContext<FSCContextType | undefined>(undefined)

export function FSCProvider({ children }: { children: ReactNode }) {
  const [fscs, setFscs] = useState<FSC[]>(mockData)

  const addFSC = (fscData: Partial<FSC>) => {
    const total = fscData.items?.reduce((acc, item) => acc + item.total, 0) || 0
    const tierInfo = getTierInfo(total)

    const newFSC: FSC = {
      ...fscData,
      id: Math.random().toString(36).substr(2, 9),
      fscNo: `${String(fscs.length + 1).padStart(3, '0')}/${new Date().getFullYear()}`,
      totalValue: total,
      tier: tierInfo.tier,
      deadline: addBusinessDays(new Date(), tierInfo.days).toISOString(),
      createdAt: new Date().toISOString(),
      status: fscData.status || 'Pendente Financeiro',
      history: [
        {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
          user: fscData.requester || 'Usuário Atual',
          action: 'Solicitação Criada',
        },
      ],
    } as FSC

    setFscs((prev) => [newFSC, ...prev])
  }

  const updateFSCStatus = (id: string, status: FSCStatus, user: string, notes?: string) => {
    setFscs((prev) =>
      prev.map((fsc) => {
        if (fsc.id === id) {
          return {
            ...fsc,
            status,
            history: [
              ...fsc.history,
              {
                id: Math.random().toString(36).substr(2, 9),
                date: new Date().toISOString(),
                user,
                action: `Status alterado para: ${status}`,
                notes,
              },
            ],
          }
        }
        return fsc
      }),
    )
  }

  const getFSC = (id: string) => fscs.find((f) => f.id === id)

  return (
    <FSCContext.Provider value={{ fscs, addFSC, updateFSCStatus, getFSC }}>
      {children}
    </FSCContext.Provider>
  )
}

export const useFSCStore = () => {
  const context = useContext(FSCContext)
  if (!context) throw new Error('useFSCStore must be used within FSCProvider')
  return context
}
