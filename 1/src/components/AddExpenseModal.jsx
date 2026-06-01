import React, { useState } from 'react'
import { fmt } from '../utils/format'
import { X, Delete } from 'lucide-react'

export default function AddExpenseModal({ store, haptic, onClose }) {
  const { categories, addExpense, currency } = store
  const [amount, setAmount] = useState('0')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [isNeed, setIsNeed] = useState(true)
  const [step, setStep] = useState('amount') // 'amount' | 'details'

  function handleNum(n) {
    haptic.selection()
    setAmount(prev => {
      if (prev === '0') return n
      if (prev.length >= 7) return prev
      return prev + n
    })
  }

  function handleDot() {
    haptic.selection()
    setAmount(prev => prev.includes('.') ? prev : prev + '.')
  }

  function handleDel() {
    haptic.light()
    setAmount(prev => prev.length <= 1 ? '0' : prev.slice(0, -1))
  }

  function handleNext() {
    if (Number(amount) <= 0) { haptic.error(); return }
    haptic.medium()
    setStep('details')
  }

  function handleSave() {
    if (Number(amount) <= 0) { haptic.error(); return }
    addExpense({ amount: Number(amount), category, note, isNeed })
    haptic.success()
    onClose()
  }

  const displayAmount = Number(amount).toLocaleString('ru-RU')

  if (step === 'details') return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div className="modal-title">Детали расхода</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Amount display */}
        <div style={{
          background: 'var(--surface)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 16px',
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>Сумма</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: 'var(--red)' }}>
            −{displayAmount} {currency}
          </span>
        </div>

        {/* Category */}
        <div className="form-group">
          <div className="form-label">Категория</div>
          <div className="cat-grid">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`cat-btn ${category === cat.id ? 'selected' : ''}`}
                onClick={() => { haptic.selection(); setCategory(cat.id) }}
              >
                <span className="cat-icon">{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="form-group">
          <div className="form-label">Заметка (необязательно)</div>
          <input
            className="input"
            placeholder="На что потратил?"
            value={note}
            onChange={e => setNote(e.target.value)}
            maxLength={60}
          />
        </div>

        {/* Need / Want toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface)',
          padding: '14px 16px',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 16,
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {isNeed ? '✅ Нужная трата' : '⚡ Ненужная трата'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
              {isNeed ? 'Необходимо для жизни' : 'Можно было не тратить'}
            </div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={isNeed} onChange={e => { haptic.selection(); setIsNeed(e.target.checked) }} />
            <span className="toggle-slider" />
          </label>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          Сохранить расход
        </button>
      </div>
    </div>
  )

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="modal-title">Расход</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Amount display */}
        <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: Number(amount) > 0 ? 'var(--text)' : 'var(--text3)',
            transition: 'color 0.2s',
          }}>
            {displayAmount}
          </div>
          <div style={{ fontSize: 16, color: 'var(--text3)', marginTop: 4 }}>{currency}</div>
        </div>

        {/* Numpad */}
        <div className="numpad">
          {['1','2','3','4','5','6','7','8','9'].map(n => (
            <button key={n} className="numpad-btn" onClick={() => handleNum(n)}>{n}</button>
          ))}
          <button className="numpad-btn special" onClick={handleDot}>.</button>
          <button className="numpad-btn" onClick={() => handleNum('0')}>0</button>
          <button className="numpad-btn special" onClick={handleDel}>
            <Delete size={18} />
          </button>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleNext}
          style={{ marginTop: 8 }}
          disabled={Number(amount) <= 0}
        >
          Далее →
        </button>
      </div>
    </div>
  )
}
