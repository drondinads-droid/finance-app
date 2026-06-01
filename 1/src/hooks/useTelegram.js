import { useEffect, useState } from 'react'

export function useTelegram() {
  const [tg, setTg] = useState(null)
  const [user, setUser] = useState(null)
  const [colorScheme, setColorScheme] = useState('dark')

  useEffect(() => {
    const webapp = window.Telegram?.WebApp
    if (webapp) {
      webapp.ready()
      webapp.expand()
      webapp.disableVerticalSwipes?.()
      setTg(webapp)
      setUser(webapp.initDataUnsafe?.user || null)
      setColorScheme(webapp.colorScheme || 'dark')
    }
  }, [])

  const haptic = {
    light: () => tg?.HapticFeedback?.impactOccurred('light'),
    medium: () => tg?.HapticFeedback?.impactOccurred('medium'),
    success: () => tg?.HapticFeedback?.notificationOccurred('success'),
    error: () => tg?.HapticFeedback?.notificationOccurred('error'),
    selection: () => tg?.HapticFeedback?.selectionChanged(),
  }

  return { tg, user, colorScheme, haptic }
}
