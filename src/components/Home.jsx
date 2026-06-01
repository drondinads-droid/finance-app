import React, { useState } from 'react'
import { fmt, fmtDate, fmtTime, pct } from '../utils/format'
import AddExpenseModal from './AddExpenseModal'
import { Plus, TrendingDown, TrendingUp, Calendar } from 'lucide-react'
import CatBanner from "./CatBanner";

export default function Home({ store, haptic }) {
  const [showAdd, setShowAdd] = useState(false)
  const {
    state, currency, monthSpent, monthLeft, dailyLimit, dailyLeft,
    monthPct, todayExpenses, monthExpenses, categories, addExpense,
  } = store

  const budgetSet = state.budget.monthly > 0
  const dailyPct = dailyLimit > 0 ? pct(Math.max(0, dailyLimit - dailyLeft), dailyLimit) : 0
  const isBudgetAlert = monthPct > 0.85
  const isDailyAlert = dailyLeft < 0

  function getCat(id) {
    return categories.find(c => c.id === id) || { emoji: '📦', name: 'Прочее' }
  }

  // Group today's expenses
  const grouped = {}
  for (const e of monthExpenses.slice(0, 30)) {
    const key = fmtDate(e.date)
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(e)
  }

  return (
    <div className="page-scroll">
      <div className="page-inner" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      <CatBanner />

        {/* Header */}
        <div style={{ paddingTop: 8 }}>
          <div className="label">Финансы</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
            <div className="amount-big" style={{ color: isBudgetAlert ? 'var(--red)' : 'var(--text)' }}>
              {budgetSet ? fmt(monthLeft, currency) : '—'}
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>
            осталось в этом месяце
          </div>
        </div>

        {/* Month progress */}
        {budgetSet && (
          <div className="card card-p fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div className="label">Бюджет месяца</div>
                <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700, marginTop: 3 }}>
                  {fmt(state.budget.monthly, currency)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="label">Потрачено</div>
                <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 700, marginTop: 3, color: 'var(--red)' }}>
                  {fmt(monthSpent, currency)}
                </div>
              </div>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${monthPct * 100}%`,
                  background: isBudgetAlert
                    ? 'linear-gradient(90deg, var(--yellow), var(--red))'
                    : 'linear-gradient(90deg, var(--accent), var(--teal))',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: 'var(--text3)' }}>0%</span>
              <span style={{ fontSize: 11, color: isBudgetAlert ? 'var(--red)' : 'var(--text3)' }}>
                {Math.round(monthPct * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Daily limit */}
        {budgetSet && (
          <div className="card card-p fade-in">
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="label" style={{ marginBottom: 6 }}>Дневной лимит</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20 }}>
                  {fmt(dailyLimit, currency)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>на сегодня</div>
                <div className="progress-track" style={{ marginTop: 8 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${dailyPct}%`,
                      background: isDailyAlert
                        ? 'var(--red)'
                        : dailyPct > 80
                          ? 'var(--yellow)'
                          : 'var(--accent)',
                    }}
                  />
                </div>
              </div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div style={{ flex: 1 }}>
                <div className="label" style={{ marginBottom: 6 }}>Остаток</div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 20,
                  color: isDailyAlert ? 'var(--red)' : 'var(--accent)',
                }}>
                  {fmt(dailyLeft, currency)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>сегодня</div>
              </div>
            </div>
          </div>
        )}

        {/* Add expense button */}
        <button
          className="btn btn-primary"
          onClick={() => { haptic.medium(); setShowAdd(true) }}
          style={{ marginTop: 4 }}
        >
          <Plus size={18} />
          Добавить расход
        </button>

        {/* Recent expenses */}
        {monthExpenses.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {Object.entries(grouped).map(([date, exps]) => (
              <div key={date} className="fade-in">
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                  marginTop: 16,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>{date}</div>
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                    {fmt(exps.reduce((s, e) => s + e.amount, 0), currency)}
                  </div>
                </div>
                <div className="card">
                  {exps.map(exp => {
                    const cat = getCat(exp.category)
                    return (
                      <div key={exp.id} className="list-item" style={{ padding: '12px 14px' }}>
                        <div className="list-icon" style={{ background: 'var(--surface)' }}>
                          {cat.emoji}
                        </div>
                        <div className="list-info">
                          <div className="list-name">{exp.note || cat.name}</div>
                          <div style={{ display: 'flex', gap: 6, marginTop: 3, alignItems: 'center' }}>
                            <span style={{ fontSize: 11, color: 'var(--text3)' }}>{fmtTime(exp.date)}</span>
                            <span
                              className="chip"
                              style={{
                                fontSize: 10,
                                padding: '2px 7px',
                                background: exp.isNeed ? 'var(--blue-dim)' : 'var(--yellow-dim)',
                                color: exp.isNeed ? 'var(--blue)' : 'var(--yellow)',
                              }}
                            >
                              {exp.isNeed ? 'нужное' : 'ненужное'}
                            </span>
                          </div>
                        </div>
                        <div className="list-amount" style={{ color: 'var(--red)' }}>
                          −{fmt(exp.amount, currency)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {monthExpenses.length === 0 && budgetSet && (
          <div className="empty">
            <div className="empty-icon">🧾</div>
            <div className="empty-text">Расходов пока нет.<br/>Добавьте первый!</div>
          </div>
        )}

        {!budgetSet && (
          <div className="card card-p" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>💸</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
              Установите бюджет
            </div>
            <div style={{ fontSize: 14, color: 'var(--text3)' }}>
              Перейдите в Настройки, чтобы задать месячный бюджет
            </div>
          </div>
        )}
      </div>

      {showAdd && (
        <AddExpenseModal
          store={store}
          haptic={haptic}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
