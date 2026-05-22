export type ExpenseCategory =
  | 'FOOD'
  | 'TRAVEL'
  | 'SHOPPING'
  | 'BILLS'
  | 'ENTERTAINMENT'
  | 'HEALTH'
  | 'OTHER'

export type Expense = {
  id: number
  title: string
  amount: number
  category: ExpenseCategory
  description?: string
  createdAt: string
  userId: number
}

export type ExpensesResponse = {
  data: Expense[]
  total: number
  page: number
  limit: number
}

export type SummaryResponse = {
  totalExpenses: number
  totalTransactions: number
  categoryBreakdown: Array<{
    category: ExpenseCategory
    total: string | number
  }>
}
