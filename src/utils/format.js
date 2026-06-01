export function fmt(amount, currency = '₽', decimals = 0) {
  const n = Math.abs(amount)
  const str = n.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
  return `${amount < 0 ? '−' : ''}${str} ${currency}`
}

export function fmtCompact(amount, currency = '₽') {
  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M ${currency}`
  }
  if (Math.abs(amount) >= 1000) {
    return `${(amount / 1000).toFixed(0)}K ${currency}`
  }
  return fmt(amount, currency)
}

export function fmtDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  if (day.getTime() === today.getTime()) return 'Сегодня'
  if (day.getTime() === yesterday.getTime()) return 'Вчера'
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export function pct(value, total) {
  if (!total) return 0
  return Math.min(100, Math.round((value / total) * 100))
}
