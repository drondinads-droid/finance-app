import React, { useState } from 'react'
import { fmt, pct } from '../utils/format'
import { Plus, X, ChevronRight, Trash2 } from 'lucide-react'

function AddSavingsModal({ store, haptic, onClose }) {
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [current, setCurrent] = useState('')
  const [emoji, setEmoji] = useState('🎯')

  const EMOJIS = ['🎯','🏖️','💻','🚗','🏠','✈️','📱','🎓','💍','🐶','🎮','👟']

  function handleSave() {
    if (!name || !target || Number(target) <= 0) { haptic.error(); return }
    store.addSavings({ name, target, current, emoji })
    haptic.success()
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="modal-title">Новая цель</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              style={{
                width: 44, height: 44, fontSize: 22, background: emoji === e ? 'var(--accent-dim)' : 'var(--surface)',
                border: emoji === e ? '2px solid var(--accent)' : '2px solid transparent',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              }}
            >{e}</button>
          ))}
        </div>

        <div className="form-group">
          <div className="form-label">Название цели</div>
          <input className="input" placeholder="Отпуск, ноутбук..." value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Целевая сумма ({store.currency})</div>
          <input className="input" type="number" placeholder="100000" value={target} onChange={e => setTarget(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Уже накоплено (необязательно)</div>
          <input className="input" type="number" placeholder="0" value={current} onChange={e => setCurrent(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: 8 }}>
          Создать цель
        </button>
      </div>
    </div>
  )
}

function AddCompModal({ store, haptic, onClose }) {
  const [name, setName] = useState('')
  const [total, setTotal] = useState('')
  const [months, setMonths] = useState('3')
  const [emoji, setEmoji] = useState('💳')

  const EMOJIS = ['💳','📱','💻','🚗','🛋️','📺','⌚','🎹','🏋️','📸']

  function handleSave() {
    if (!name || !total || Number(total) <= 0) { haptic.error(); return }
    store.addCompensation({ name, total, months, emoji })
    haptic.success()
    onClose()
  }

  const monthly = total && months ? Math.ceil(Number(total) / Number(months)) : 0

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="modal-title">Крупная покупка</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          {EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              style={{
                width: 44, height: 44, fontSize: 22, background: emoji === e ? 'var(--accent-dim)' : 'var(--surface)',
                border: emoji === e ? '2px solid var(--accent)' : '2px solid transparent',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              }}
            >{e}</button>
          ))}
        </div>

        <div className="form-group">
          <div className="form-label">Что купил?</div>
          <input className="input" placeholder="iPhone, диван..." value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Стоимость ({store.currency})</div>
          <input className="input" type="number" placeholder="50000" value={total} onChange={e => setTotal(e.target.value)} />
        </div>
        <div className="form-group">
          <div className="form-label">Срок компенсации (месяцев)</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['1','2','3','6','12'].map(m => (
              <button
                key={m}
                onClick={() => setMonths(m)}
                style={{
                  flex: 1, padding: '10px 0', background: months === m ? 'var(--accent-dim)' : 'var(--surface)',
                  border: months === m ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                  borderRadius: 'var(--radius-xs)', color: months === m ? 'var(--accent)' : 'var(--text2)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-display)',
                }}
              >{m}</button>
            ))}
          </div>
        </div>

        {monthly > 0 && (
          <div style={{
            background: 'var(--accent-dim)', border: '1px solid rgba(184,255,101,0.2)',
            borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>Ежемесячная нагрузка</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--accent)', marginTop: 2 }}>
              {fmt(monthly, store.currency)} /мес
            </div>
          </div>
        )}

        <button className="btn btn-primary" onClick={handleSave}>Добавить</button>
      </div>
    </div>
  )
}

function DepositModal({ item, store, haptic, onClose }) {
  const [amount, setAmount] = useState('')

  function handleDeposit() {
    if (!amount || Number(amount) <= 0) { haptic.error(); return }
    store.updateSavings(item.id, Number(amount))
    haptic.success()
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div className="modal-title">{item.emoji} {item.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>
          Накоплено {fmt(item.current, store.currency)} из {fmt(item.target, store.currency)}
        </div>
        <div className="form-group">
          <div className="form-label">Пополнить на ({store.currency})</div>
          <input className="input" type="number" placeholder="5000" value={amount} onChange={e => setAmount(e.target.value)} autoFocus />
        </div>
        <button className="btn btn-primary" onClick={handleDeposit} style={{ marginTop: 8 }}>Пополнить</button>
      </div>
    </div>
  )
}

export default function Savings({ store, haptic }) {
  const [tab, setTab] = useState('savings')
  const [showAddSavings, setShowAddSavings] = useState(false)
  const [showAddComp, setShowAddComp] = useState(false)
  const [depositItem, setDepositItem] = useState(null)
  const { state, currency, deleteSavings, deleteCompensation, payCompensation } = store

  const totalSaved = state.savings.reduce((s, g) => s + g.current, 0)
  const totalTarget = state.savings.reduce((s, g) => s + g.target, 0)
  const totalCompLeft = state.compensations.reduce((s, c) => s + (c.total - c.paid), 0)

  return (
    <div className="page-scroll">
      <div className="page-inner" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        <div style={{ paddingTop: 8 }}>
          <div className="label">Сбережения</div>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 800, marginTop: 4 }}>
            {fmt(totalSaved, currency)}
            <span style={{ fontSize: 14, color: 'var(--text3)', fontWeight: 400 }}> накоплено</span>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab-btn ${tab === 'savings' ? 'active' : ''}`} onClick={() => setTab('savings')}>
            Накопления
          </button>
          <button className={`tab-btn ${tab === 'comp' ? 'active' : ''}`} onClick={() => setTab('comp')}>
            Компенсации
          </button>
        </div>

        {tab === 'savings' && (
          <>
            <button className="btn btn-ghost" style={{ alignSelf: 'flex-start' }}
              onClick={() => { haptic.medium(); setShowAddSavings(true) }}>
              <Plus size={16} /> Новая цель
            </button>

            {state.savings.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">🎯</div>
                <div className="empty-text">Нет целей накопления.<br/>Добавьте первую!</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {state.savings.map(goal => {
                  const p = pct(goal.current, goal.target)
                  const done = goal.current >= goal.target
                  return (
                    <div key={goal.id} className="card card-p savings-card fade-in">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <span style={{ fontSize: 28 }}>{goal.emoji}</span>
                          <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{goal.name}</div>
                            {done && <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>✅ Цель достигнута!</div>}
                          </div>
                        </div>
                        <button onClick={() => { haptic.light(); deleteSavings(goal.id) }}
                          style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4 }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>Накоплено</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)', fontSize: 18 }}>
                            {fmt(goal.current, currency)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>Цель</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
                            {fmt(goal.target, currency)}
                          </div>
                        </div>
                      </div>
                      <div className="comp-bar">
                        <div className="comp-fill" style={{ width: `${p}%` }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: 'var(--text3)' }}>{p}%</span>
                        <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                          ещё {fmt(Math.max(0, goal.target - goal.current), currency)}
                        </span>
                      </div>
                      {!done && (
                        <button className="btn btn-ghost" style={{ marginTop: 12, width: '100%' }}
                          onClick={() => { haptic.medium(); setDepositItem(goal) }}>
                          + Пополнить
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {tab === 'comp' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {totalCompLeft > 0 && (
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                    Ещё погасить: <strong style={{ color: 'var(--red)' }}>{fmt(totalCompLeft, currency)}</strong>
                  </div>
                )}
              </div>
              <button className="btn btn-ghost"
                onClick={() => { haptic.medium(); setShowAddComp(true) }}>
                <Plus size={16} /> Добавить
              </button>
            </div>

            {state.compensations.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">💳</div>
                <div className="empty-text">Нет крупных покупок.<br/>Добавьте для отслеживания.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {state.compensations.map(comp => {
                  const p = pct(comp.paid, comp.total)
                  const left = comp.total - comp.paid
                  const monthly = Math.ceil(comp.total / comp.months)
                  const done = comp.paid >= comp.total
                  return (
                    <div key={comp.id} className="card card-p fade-in">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <span style={{ fontSize: 28 }}>{comp.emoji}</span>
                          <div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{comp.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                              ~{fmt(monthly, currency)}/мес · {comp.months} мес.
                            </div>
                          </div>
                        </div>
                        <button onClick={() => { haptic.light(); deleteCompensation(comp.id) }}
                          style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4 }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>Погашено</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--teal)', fontSize: 17 }}>
                            {fmt(comp.paid, currency)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>{done ? 'Погашено!' : 'Осталось'}</div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: done ? 'var(--accent)' : 'var(--red)' }}>
                            {done ? '✅' : fmt(left, currency)}
                          </div>
                        </div>
                      </div>
                      <div className="comp-bar">
                        <div className="comp-fill" style={{ width: `${p}%` }} />
                      </div>
                      {!done && (
                        <button className="btn btn-ghost" style={{ marginTop: 12, width: '100%' }}
                          onClick={() => {
                            haptic.medium()
                            payCompensation(comp.id, monthly)
                          }}>
                          Внести {fmt(monthly, currency)}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {showAddSavings && <AddSavingsModal store={store} haptic={haptic} onClose={() => setShowAddSavings(false)} />}
      {showAddComp && <AddCompModal store={store} haptic={haptic} onClose={() => setShowAddComp(false)} />}
      {depositItem && <DepositModal item={depositItem} store={store} haptic={haptic} onClose={() => setDepositItem(null)} />}
    </div>
  )
}
