import api from '../api/axios'
import type {
  Expense,
  ExpenseCategory,
  ExpensesResponse,
  SummaryResponse,
} from '../types/expense'

export type CreateExpensePayload = {
  title: string
  amount: number
  category: ExpenseCategory
  description?: string
}

export type UpdateExpensePayload = Partial<CreateExpensePayload>

export const getExpenses = async (params: {
  category?: ExpenseCategory | 'ALL'
  page?: number
  limit?: number
  sort?: 'ASC' | 'DESC'
}) => {
  const response = await api.get<ExpensesResponse>(
    '/expenses',
    {
      params: {
        category:
          params.category && params.category !== 'ALL'
            ? params.category
            : undefined,
        page: params.page,
        limit: params.limit,
        sort: params.sort,
      },
    },
  )
  return response.data
}

export const getSummary = async () => {
  const response = await api.get<SummaryResponse>('/expenses/summary')
  return response.data
}

export const createExpense = async (
  payload: CreateExpensePayload,
) => {
  const response = await api.post<Expense>('/expenses', payload)
  return response.data
}

export const updateExpense = async (
  id: number,
  payload: UpdateExpensePayload,
) => {
  const response = await api.patch<Expense>(
    `/expenses/${id}`,
    payload,
  )
  return response.data
}

export const deleteExpense = async (id: number) => {
  const response = await api.delete<{ message: string }>(
    `/expenses/${id}`,
  )
  return response.data
}
