import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import type { Expense, ExpenseCategory } from '../types/expense'
import {
  createExpense,
  deleteExpense,
  getExpenses,
  getSummary,
} from '../services/expenses.service'

const categories: ExpenseCategory[] = [
  'FOOD',
  'TRAVEL',
  'SHOPPING',
  'BILLS',
  'ENTERTAINMENT',
  'HEALTH',
  'OTHER',
]

const COLORS = ['#63ffd6', '#7bb8ff', '#ffc757', '#ff6b9d', '#8b5cf6', '#06b6d4', '#10b981']

const generatePieData = (
  breakdown: Array<{ category: string; total: string }>,
) => {
  const total = breakdown.reduce((sum, item) => sum + Number(item.total), 0)
  return breakdown.map((item, index) => ({
    name: item.category,
    value: Number(item.total),
    percentage: total > 0 ? ((Number(item.total) / total) * 100).toFixed(1) : 0,
    color: COLORS[index % COLORS.length],
  }))
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    totalTransactions: 0,
    categoryBreakdown: [] as Array<{ category: string; total: string }>,
  })
  const [page, setPage] = useState(1)
  const [limit] = useState(8)
  const [total, setTotal] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState<
    ExpenseCategory | 'ALL'
  >('ALL')
  const [dateFilter, setDateFilter] = useState<'ALL' | 'MONTH' | 'WEEK' | 'DAY'>('ALL')
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'FOOD' as ExpenseCategory,
    description: '',
  })

  const getDateRangeFilter = (filter: string) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    switch (filter) {
      case 'DAY':
        return { start: today, end: new Date(today.getTime() + 86400000) }
      case 'WEEK': {
        const start = new Date(today)
        start.setDate(today.getDate() - today.getDay())
        return { start, end: new Date(start.getTime() + 604800000) }
      }
      case 'MONTH':
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
        }
      default:
        return null
    }
  }

  const filterExpensesByDate = (
    expenses: Expense[],
    filter: string,
  ): Expense[] => {
    const range = getDateRangeFilter(filter)
    if (!range) return expenses

    return expenses.filter((exp) => {
      const expDate = new Date(exp.createdAt)
      return expDate >= range.start && expDate <= range.end
    })
  }

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit],
  )

  const filteredExpenses = useMemo(
    () => filterExpensesByDate(expenses, dateFilter),
    [expenses, dateFilter],
  )

  const loadSummary = async () => {
    try {
      const data = await getSummary()
      setSummary({
        ...data,
        categoryBreakdown: data.categoryBreakdown.map(
          (item) => ({
            category: item.category,
            total: String(item.total),
          }),
        ),
      })
    } catch (err) {
      console.error(err)
    }
  }

  const loadExpenses = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getExpenses({
        category: categoryFilter,
        page,
        limit,
        sort,
      })
      setExpenses(data.data)
      setTotal(data.total)
    } catch (err) {
      console.error(err)
      setError('Unable to load expenses.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
  }, [])

  useEffect(() => {
    loadExpenses()
  }, [categoryFilter, page, sort])

  const handleFormChange = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm({
      title: '',
      amount: '',
      category: 'FOOD',
      description: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        description: form.description || undefined,
      }

      await createExpense(payload)

      resetForm()
      await Promise.all([loadExpenses(), loadSummary()])
    } catch (err) {
      console.error(err)
      setError('Unable to save expense. Please retry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      'Delete this expense?',
    )
    if (!confirmDelete) return

    try {
      await deleteExpense(id)
      await Promise.all([loadExpenses(), loadSummary()])
    } catch (err) {
      console.error(err)
      setError('Unable to delete expense.')
    }
  }

  const pieData = useMemo(
    () => generatePieData(summary.categoryBreakdown),
    [summary.categoryBreakdown],
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="glass-panel">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                Summary
              </p>
              <h2 className="text-3xl font-semibold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
                Overview for this month
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="chip"
                onClick={loadSummary}
              >
                Refresh summary
              </button>
              <button
                type="button"
                className="chip"
                onClick={loadExpenses}
              >
                Refresh list
              </button>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="stat-card">
                <p className="stat-label">Total spent</p>
                <p className="stat-value">INR {summary.totalExpenses}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Transactions</p>
                <p className="stat-value">{summary.totalTransactions}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Top category</p>
                <p className="stat-value">
                  {summary.categoryBreakdown[0]?.category || '-'}
                </p>
              </div>
            </div>

            <div className="chart-container rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60 mb-4">
                Category Breakdown
              </p>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ index }) => {
                        const entry = pieData[index || 0]
                        return `${entry.name}: ${entry.percentage}%`
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={600}
                      animationEasing="ease-out"
                    >
                      {pieData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(12, 16, 28, 0.9)',
                        border: '1px solid rgba(100, 255, 218, 0.3)',
                        borderRadius: '12px',
                        color: '#f8f7f4',
                      }}
                      formatter={(value) => `INR ${value}`}
                    />
                    <Legend
                      wrapperStyle={{
                        paddingTop: '20px',
                      }}
                      formatter={(value) => (
                        <span style={{ color: '#f8f7f4' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-white/60">
                  No data available
                </div>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {summary.categoryBreakdown.map((item, idx) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all hover:bg-white/8"
                  style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: COLORS[idx % COLORS.length],
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <span className="font-medium">{item.category}</span>
                  <span className="font-semibold">INR {item.total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel">
          <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
            Add expense
          </h2>
          <p className="text-sm text-white/60 mt-2">
            Capture every purchase to keep your budget sharp.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="flex flex-col gap-2 text-sm">
              <span className="text-white/80 font-medium">Title</span>
              <input
                className="input"
                placeholder="Dinner with team"
                value={form.title}
                onChange={(e) =>
                  handleFormChange('title', e.target.value)
                }
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-white/80 font-medium">Amount</span>
              <input
                className="input"
                type="number"
                min={1}
                step="0.01"
                placeholder="1200"
                value={form.amount}
                onChange={(e) =>
                  handleFormChange('amount', e.target.value)
                }
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-white/80 font-medium">Category</span>
              <select
                className="input"
                value={form.category}
                onChange={(e) =>
                  handleFormChange(
                    'category',
                    e.target.value,
                  )
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="text-white/80 font-medium">Description</span>
              <textarea
                className="input min-h-[100px]"
                placeholder="Optional notes"
                value={form.description}
                onChange={(e) =>
                  handleFormChange('description', e.target.value)
                }
              />
            </label>

            {error ? (
              <p className="text-sm text-rose-200 animate-pulse">{error}</p>
            ) : null}

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : 'Save expense'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="glass-panel">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              Activity
            </p>
            <h2 className="text-3xl font-semibold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
              Recent expenses
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="input"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(
                  e.target.value as ExpenseCategory | 'ALL',
                )
                setPage(1)
              }}
            >
              <option value="ALL">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="input"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(
                  e.target.value as 'ALL' | 'MONTH' | 'WEEK' | 'DAY',
                )
              }}
            >
              <option value="ALL">All time</option>
              <option value="MONTH">This month</option>
              <option value="WEEK">This week</option>
              <option value="DAY">Today</option>
            </select>
            <select
              className="input"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as 'ASC' | 'DESC')
                setPage(1)
              }}
            >
              <option value="DESC">Newest first</option>
              <option value="ASC">Oldest first</option>
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-white/60">
                Loading expenses...
              </div>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <p className="text-white/60 text-center py-8">
              No expenses yet. Add your first one on the right.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredExpenses.map((expense, idx) => (
                <div
                  key={expense.id}
                  className="expense-row"
                  style={{
                    animationDelay: `${idx * 50}ms`,
                  }}
                >
                  <div className="flex-1">
                    <p className="text-lg font-medium">
                      {expense.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-white/60 mt-1">
                      <span>{expense.category}</span>
                      {expense.description && (
                        <>
                          <span>•</span>
                          <span>{expense.description}</span>
                        </>
                      )}
                      <span>•</span>
                      <span className="text-xs">
                        {formatDate(expense.createdAt)} {formatTime(expense.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      INR {expense.amount}
                    </p>
                    <div className="mt-2 flex items-center justify-end gap-2 text-xs uppercase tracking-[0.2em]">
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() =>
                          navigate(`/expense/${expense.id}/edit`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-ghost text-rose-200 hover:text-rose-100"
                        onClick={() => handleDelete(expense.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
          <span className="text-sm text-white/60">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() =>
                setPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
