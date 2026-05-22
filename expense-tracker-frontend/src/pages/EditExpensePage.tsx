import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Expense, ExpenseCategory } from '../types/expense'
import { getExpenses, updateExpense } from '../services/expenses.service'

const categories: ExpenseCategory[] = [
  'FOOD',
  'TRAVEL',
  'SHOPPING',
  'BILLS',
  'ENTERTAINMENT',
  'HEALTH',
  'OTHER',
]

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [expense, setExpense] = useState<Expense | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'FOOD' as ExpenseCategory,
    description: '',
  })

  useEffect(() => {
    const loadExpense = async () => {
      try {
        const data = await getExpenses({ limit: 1000 })
        const foundExpense = data.data.find(
          (e) => e.id === Number(id),
        )
        if (foundExpense) {
          setExpense(foundExpense)
          setForm({
            title: foundExpense.title,
            amount: String(foundExpense.amount),
            category: foundExpense.category,
            description: foundExpense.description ?? '',
          })
        } else {
          setError('Expense not found')
        }
      } catch (err) {
        console.error(err)
        setError('Unable to load expense')
      } finally {
        setIsLoading(false)
      }
    }

    loadExpense()
  }, [id])

  const handleFormChange = (
    field: keyof typeof form,
    value: string,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
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

      await updateExpense(Number(id), payload)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Unable to update expense. Please retry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse text-white/60">
          Loading expense...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="glass-panel max-w-2xl">
        <div className="mb-8">
          <button
            type="button"
            className="text-sm text-cyan-300 hover:text-cyan-200 mb-4"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to dashboard
          </button>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">
            Edit expense
          </p>
          <h1 className="text-3xl font-semibold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-300">
            {expense?.title}
          </h1>
          <p className="text-sm text-white/60 mt-4">
            Created on{' '}
            {expense?.createdAt
              ? new Date(expense.createdAt).toLocaleDateString(
                  'en-US',
                  {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                )
              : 'Unknown date'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <span className="text-white/80 font-medium">
              Description
            </span>
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
            <p className="text-sm text-rose-200 animate-pulse">
              {error}
            </p>
          ) : null}

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update expense'}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
