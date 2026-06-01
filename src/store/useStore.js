import { useState, useCallback } from 'react'

const STORAGE_KEY = 'tg_finance_v1'

const DEFAULT_CATEGORIES = [
  { id: 'food',      emoji: '🍕', name: 'Еда',       color: '--orange' },
  { id: 'transport', emoji: '🚇', name: 'Транспорт', color: '--blue'   },
  { id: 'shopping',  emoji: '🛍️', name: 'Покупки',   color: '--purple' },
  { id: 'health',    emoji: '💊', name: 'Здоровье',  color: '--teal'   },
  { id: 'entertain', emoji: '🎮', name: 'Развлечения',color: '--yellow' },
  { id: 'home',      emoji: '🏠', name: 'Дом',       color: '--red'    },
  { id: 'beauty',    emoji: '✂️', name: 'Красота',   color: '--purple' },
  { id: 'other',     emoji: '📦', name: 'Прочее',    color: '--text3'  },
]

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

function getInitialState() {
  const saved = loadState()
  if (saved) return saved
  return {
    budget: { monthly: 0, currency: '₽' },
    expenses: [],
    savings: [],
    compensations: [],
    categories: DEFAULT_CATEGORIES,
    settings: { showCents: false },
  }
}

export { DEFAULT_CATEGORIES }

export function useStore() {
  const [state, setStateRaw] = useState(getInitialState)

  const setState = useCallback((updater) => {
    setStateRaw(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveState(next)
      return next
    })
  }, [])

  // ── Budget ──
  const setBudget = useCallback((monthly, currency = '₽') => {
    setState(s => ({ ...s, budget: { monthly: Number(monthly), currency } }))
  }, [setState])

  // ── Expenses ──
  const addExpense = useCallback((expense) => {
    const item = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amount: Number(expense.amount),
      category: expense.category,
      note: expense.note || '',
      isNeed: expense.isNeed ?? true,
    }
    setState(s => ({ ...s, expenses: [item, ...s.expenses] }))
    return item
  }, [setState])

  const deleteExpense = useCallback((id) => {
    setState(s => ({ ...s, expenses: s.expenses.filter(e => e.id !== id) }))
  }, [setState])

  // ── Savings ──
  const addSavings = useCallback((goal) => {
    const item = {
      id: Date.now().toString(),
      name: goal.name,
      target: Number(goal.target),
      current: Number(goal.current || 0),
      emoji: goal.emoji || '🎯',
      createdAt: new Date().toISOString(),
    }
    setState(s => ({ ...s, savings: [...s.savings, item] }))
  }, [setState])

  const updateSavings = useCallback((id, amount) => {
    setState(s => ({
      ...s,
      savings: s.savings.map(g =>
        g.id === id
          ? { ...g, current: Math.min(g.target, g.current + Number(amount)) }
          : g
      )
    }))
  }, [setState])

  const deleteSavings = useCallback((id) => {
    setState(s => ({ ...s, savings: s.savings.filter(g => g.id !== id) }))
  }, [setState])

  // ── Compensations ──
  const addCompensation = useCallback((comp) => {
    const item = {
      id: Date.now().toString(),
      name: comp.name,
      total: Number(comp.total),
      paid: Number(comp.paid || 0),
      emoji: comp.emoji || '💳',
      months: Number(comp.months || 1),
      createdAt: new Date().toISOString(),
    }
    setState(s => ({ ...s, compensations: [...s.compensations, item] }))
  }, [setState])

  const payCompensation = useCallback((id, amount) => {
    setState(s => ({
      ...s,
      compensations: s.compensations.map(c =>
        c.id === id
          ? { ...c, paid: Math.min(c.total, c.paid + Number(amount)) }
          : c
      )
    }))
  }, [setState])

  const deleteCompensation = useCallback((id) => {
    setState(s => ({ ...s, compensations: s.compensations.filter(c => c.id !== id) }))
  }, [setState])

  // ── Computed ──
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const monthExpenses = state.expenses.filter(e => new Date(e.date) >= monthStart)
  const todayExpenses = state.expenses.filter(e => new Date(e.date) >= todayStart)

  const monthSpent = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const todaySpent = todayExpenses.reduce((s, e) => s + e.amount, 0)
  const monthLeft = state.budget.monthly - monthSpent

  // Daily limit = remaining budget / remaining days in month
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const dayOfMonth = now.getDate()
  const daysLeft = daysInMonth - dayOfMonth + 1
  const dailyLimit = monthLeft > 0 ? Math.floor(monthLeft / daysLeft) : 0
  const dailyLeft = dailyLimit - todaySpent

  const monthPct = state.budget.monthly > 0
    ? Math.min(1, monthSpent / state.budget.monthly)
    : 0

  const catStats = {}
  for (const e of monthExpenses) {
    catStats[e.category] = (catStats[e.category] || 0) + e.amount
  }

  return {
    state,
    // actions
    setBudget,
    addExpense, deleteExpense,
    addSavings, updateSavings, deleteSavings,
    addCompensation, payCompensation, deleteCompensation,
    // computed
    monthExpenses, todayExpenses,
    monthSpent, todaySpent, monthLeft,
    dailyLimit, dailyLeft,
    monthPct,
    catStats,
    daysLeft,
    currency: state.budget.currency,
    categories: state.categories,
  }
}
