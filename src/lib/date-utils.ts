export function addBusinessDays(startDate: Date, daysToAdd: number): Date {
  let count = 0
  const currentDate = new Date(startDate)

  while (count < daysToAdd) {
    currentDate.setDate(currentDate.getDate() + 1)
    const dayOfWeek = currentDate.getDay()
    // Skip weekends (0 is Sunday, 6 is Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++
    }
  }

  return currentDate
}

export function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function getTierInfo(totalValue: number) {
  if (totalValue <= 5000) return { tier: 1, label: 'Até R$ 5.000', days: 5, budgets: 1 }
  if (totalValue <= 15000) return { tier: 2, label: 'R$ 5.001 a R$ 15.000', days: 7, budgets: 3 }
  if (totalValue <= 30000) return { tier: 3, label: 'R$ 15.001 a R$ 30.000', days: 10, budgets: 3 }
  return { tier: 4, label: 'Acima de R$ 30.000', days: 15, budgets: 3 }
}
