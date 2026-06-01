import React, { useState } from 'react'
import { fmt } from '../utils/format'
import { Check, Trash2, AlertTriangle } from 'lucide-react'

export default function Settings({ store, haptic }) {
  const { state, setBudget, currency } = store
  const [monthly, setMonthly] = useState(String(state.budget.monthly || ''))
  const [cur, setCur] = useState(state.budget.currency || '₽')
  const [saved, setSaved] = useState(false)
  const [showReset, setShowReset] = useState(false)

  const CURRENCIES = ['₽', '$', '€', '£', '₸', '₴']

  function handleSave() {
    if (!monthly || Number(monthly) <= 0) { haptic.error(); return }
    setBudget(Number(monthly), cur)
    haptic.success()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleReset() {
    localStorage.clear()
    window.location.reload()
  }

  const dailyIdeal = state.budget.monthly > 0
    ? Math.floor(state.budget.monthly / 30)
    : 0

  return (
    <div className="page-scroll">
      <div className="page-inner" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        <div style={{ paddingTop: 8 }}>
          <div className="label">Настройки</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 800, marginTop: 4 }}>
            Бюджет
          </div>
        </div>

        {/* Currency */}
        <div>
          <div className="form-label" style={{ marginBottom: 8 }}>Валюта</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {CURRENCIES.map(c => (
              <button
                key={c}
                onClick={() => { haptic.selection(); setCur(c) }}
                style={{
                  flex: 1, padding: '10px 4px',
                  background: cur === c ? 'var(--accent-dim)' : 'var(--surface)',
                  border: cur === c ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                  borderRadius: 'var(--radius-xs)',
                  color: cur === c ? 'var(--accent)' : 'var(--text2)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 16, fontWeight: 700, cursor: 'pointer',
                }}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* Monthly budget */}
        <div>
          <div className="form-label" style={{ marginBottom: 8 }}>Месячный бюджет</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              type="number"
              placeholder="100000"
              value={monthly}
              onChange={e => setMonthly(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary"
              onClick={handleSave}
              style={{ width: 'auto', padding: '0 20px', background: saved ? 'var(--teal)' : undefined }}
            >
              {saved ? <Check size={18} /> : 'OK'}
            </button>
          </div>

          {monthly && Number(monthly) > 0 && (
            <div style={{ marginTop: 10, padding: '12px 14px', background: 'var(--accent-dim)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>При бюджете {fmt(Number(monthly), cur)}:</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>Дневной лимит</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', fontSize: 17 }}>
                    {fmt(Math.floor(Number(monthly) / 30), cur)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>В неделю</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', fontSize: 17 }}>
                    {fmt(Math.floor(Number(monthly) / 4.3), cur)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="divider" />

        {/* Stats */}
        <div>
          <div className="section-title" style={{ marginBottom: 12 }}>Статистика</div>
          <div className="card">
            {[
              { label: 'Расходов всего', value: state.expenses.length },
              { label: 'Целей накопления', value: state.savings.length },
              { label: 'Компенсаций', value: state.compensations.length },
            ].map((s, i, arr) => (
              <div key={s.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '13px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: 14, color: 'var(--text2)' }}>{s.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Danger zone */}
        <div>
          <div className="section-title" style={{ marginBottom: 12, color: 'var(--red)' }}>Опасная зона</div>
          {!showReset ? (
            <button className="btn btn-danger" style={{ width: '100%', padding: '14px' }}
              onClick={() => { haptic.medium(); setShowReset(true) }}>
              <Trash2 size={16} /> Сбросить все данные
            </button>
          ) : (
            <div className="card card-p" style={{ background: 'var(--red-dim)', border: '1px solid rgba(255,95,109,0.3)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 14 }}>
                <AlertTriangle size={18} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 14, color: 'var(--red)' }}>
                  Все данные будут удалены безвозвратно. Это действие нельзя отменить.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowReset(false)}>
                  Отмена
                </button>
                <button className="btn btn-danger" style={{ flex: 1, padding: '12px' }} onClick={handleReset}>
                  Удалить всё
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}
