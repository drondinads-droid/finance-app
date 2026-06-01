import React, { useState } from 'react'
import { fmt, pct } from '../utils/format'

export default function Analytics({ store }) {
  const { monthExpenses, catStats, categories, currency, monthSpent, state } = store
  const [tab, setTab] = useState('cats') // cats | need

  const needSpent = monthExpenses.filter(e => e.isNeed).reduce((s, e) => s + e.amount, 0)
  const wantSpent = monthExpenses.filter(e => !e.isNeed).reduce((s, e) => s + e.amount, 0)
  const needPct = monthSpent > 0 ? Math.round((needSpent / monthSpent) * 100) : 0
  const wantPct = 100 - needPct

  const sortedCats = categories
    .map(cat => ({ ...cat, spent: catStats[cat.id] || 0 }))
    .filter(c => c.spent > 0)
    .sort((a, b) => b.spent - a.spent)

  const maxSpent = sortedCats[0]?.spent || 1

  return (
    <div className="page-scroll">
      <div className="page-inner" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        <div style={{ paddingTop: 8 }}>
          <div className="label">Аналитика</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 800, marginTop: 4 }}>
            Этот месяц
          </div>
        </div>

        {/* Total */}
        <div className="card card-p">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="label">Итого потрачено</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginTop: 4, color: 'var(--red)' }}>
                {fmt(monthSpent, currency)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="label">Транзакций</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginTop: 4 }}>
                {monthExpenses.length}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab-btn ${tab === 'cats' ? 'active' : ''}`} onClick={() => setTab('cats')}>
            По категориям
          </button>
          <button className={`tab-btn ${tab === 'need' ? 'active' : ''}`} onClick={() => setTab('need')}>
            Нужное/Ненужное
          </button>
        </div>

        {tab === 'cats' && (
          <>
            {sortedCats.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📊</div>
                <div className="empty-text">Нет данных за этот месяц</div>
              </div>
            ) : (
              <div className="card" style={{ overflow: 'visible' }}>
                {sortedCats.map((cat, i) => (
                  <div key={cat.id} style={{ padding: '14px 16px', borderBottom: i < sortedCats.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{cat.name}</span>
                          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
                            {fmt(cat.spent, currency)}
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>
                          {pct(cat.spent, monthSpent)}% от бюджета
                        </div>
                      </div>
                    </div>
                    <div className="progress-track" style={{ height: 5 }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${pct(cat.spent, maxSpent)}%`,
                          background: i === 0 ? 'var(--red)' : i === 1 ? 'var(--orange)' : 'var(--accent)',
                          opacity: 1 - i * 0.08,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'need' && (
          <>
            {/* Visual donut-like */}
            <div className="card card-p">
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--blue)', fontWeight: 600, marginBottom: 4 }}>✅ Нужное</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>
                    {fmt(needSpent, currency)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{needPct}%</div>
                  <div className="progress-track" style={{ marginTop: 8 }}>
                    <div className="progress-fill" style={{ width: `${needPct}%`, background: 'var(--blue)' }} />
                  </div>
                </div>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--yellow)', fontWeight: 600, marginBottom: 4 }}>⚡ Ненужное</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>
                    {fmt(wantSpent, currency)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{wantPct}%</div>
                  <div className="progress-track" style={{ marginTop: 8 }}>
                    <div className="progress-fill" style={{ width: `${wantPct}%`, background: 'var(--yellow)' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tip */}
            {wantPct > 30 && (
              <div className="card card-p" style={{ background: 'var(--yellow-dim)', border: '1px solid rgba(255,204,68,0.2)' }}>
                <div style={{ fontSize: 13, color: 'var(--yellow)' }}>
                  💡 <strong>{wantPct}%</strong> расходов — ненужные траты ({fmt(wantSpent, currency)}).
                  Сократив их на половину, вы сэкономите {fmt(wantSpent / 2, currency)}.
                </div>
              </div>
            )}

            {/* List */}
            <div style={{ marginTop: 4 }}>
              <div className="section-header">
                <div className="section-title">Ненужные траты</div>
              </div>
              {monthExpenses.filter(e => !e.isNeed).length === 0 ? (
                <div className="empty" style={{ padding: '24px 0' }}>
                  <div className="empty-icon">🎉</div>
                  <div className="empty-text">Всё разумно!</div>
                </div>
              ) : (
                <div className="card">
                  {monthExpenses.filter(e => !e.isNeed).slice(0, 10).map((exp, i, arr) => {
                    const cat = store.categories.find(c => c.id === exp.category) || { emoji: '📦', name: 'Прочее' }
                    return (
                      <div key={exp.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 14px',
                        borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                      }}>
                        <span style={{ fontSize: 20 }}>{cat.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 500 }}>{exp.note || cat.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                            {new Date(exp.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, color: 'var(--yellow)' }}>
                          {fmt(exp.amount, currency)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
