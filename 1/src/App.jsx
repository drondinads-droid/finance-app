import React, { useState } from 'react'
import { useStore } from './store/useStore'
import { useTelegram } from './hooks/useTelegram'
import Home from './components/Home'
import Analytics from './components/Analytics'
import Savings from './components/Savings'
import Settings from './components/Settings'

// Icons
function HomeIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}

function ChartIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <rect x="2" y="12" width="4" height="10" rx="1" />
      <rect x="10" y="7" width="4" height="15" rx="1" />
      <rect x="18" y="2" width="4" height="20" rx="1" />
    </svg>
  )
}

function PiggyIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <path d="M19 11c0-3.87-3.58-7-8-7S3 7.13 3 11c0 2.39 1.26 4.52 3.24 5.9L5.5 20h2.5l.5-1h4l.5 1H16l-.74-3.1C18.74 15.52 20 13.39 20 11z" />
      <path d="M20 8h1a1 1 0 011 1v3a1 1 0 01-1 1h-1" />
      <circle cx="9" cy="11" r="1" fill="currentColor" />
    </svg>
  )
}

function GearIcon({ active }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

const TABS = [
  { id: 'home',      label: 'Главная',   Icon: HomeIcon  },
  { id: 'analytics', label: 'Аналитика', Icon: ChartIcon },
  { id: 'savings',   label: 'Копилка',   Icon: PiggyIcon },
  { id: 'settings',  label: 'Настройки', Icon: GearIcon  },
]

export default function App() {
  const [tab, setTab] = useState('home')
  const store = useStore()
  const { haptic } = useTelegram()

  function handleTab(id) {
    if (id !== tab) { haptic.selection(); setTab(id) }
  }

  return (
    <div className="app-shell">
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {tab === 'home'      && <Home      store={store} haptic={haptic} />}
        {tab === 'analytics' && <Analytics store={store} haptic={haptic} />}
        {tab === 'savings'   && <Savings   store={store} haptic={haptic} />}
        {tab === 'settings'  && <Settings  store={store} haptic={haptic} />}
      </div>

      <nav className="bottom-nav">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`nav-item ${tab === id ? 'active' : ''}`}
            onClick={() => handleTab(id)}
          >
            <Icon active={tab === id} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
