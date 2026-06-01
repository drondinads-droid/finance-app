# 💸 Finance Mini App for Telegram

Минималистичное приложение для учёта личных финансов как Telegram Mini App.

## Функции

- **📊 Месячный бюджет** — устанавливаете лимит на месяц, видите сколько осталось
- **📅 Дневной лимит** — автоматически считается из остатка / оставшихся дней
- **➕ Добавление расходов** — нумпад, категории, заметки
- **🏷️ Категории** — Еда, Транспорт, Покупки, Здоровье, Развлечения, Дом, Красота, Прочее
- **✅ Нужное/Ненужное** — помечайте траты, смотрите аналитику
- **🐷 Накопления** — цели с прогресс-баром, пополнение
- **💳 Компенсации** — отслеживание крупных покупок с помесячной нагрузкой

---

## Быстрый старт

### 1. Установите зависимости
```bash
cd telegram-finance-app
npm install
```

### 2. Запустите dev-сервер
```bash
npm run dev
```

### 3. Сборка для продакшна
```bash
npm run build
# Файлы в папке dist/
```

---

## Деплой и подключение к Telegram

### Шаг 1: Разместите приложение
Загрузите папку `dist/` на любой хостинг со HTTPS:
- [Vercel](https://vercel.com) — `vercel --prod`
- [Netlify](https://netlify.com) — drag & drop папки dist
- [GitHub Pages](https://pages.github.com)
- Любой VPS с nginx

### Шаг 2: Создайте бота
1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`, следуйте инструкциям
3. Сохраните токен бота

### Шаг 3: Создайте Mini App
В @BotFather:
```
/newapp
```
Или для существующего бота:
```
/mybots → Выберите бота → Bot Settings → Menu Button → Configure menu button
```
Введите URL вашего задеплоенного приложения.

### Шаг 4: Настройте Menu Button (опционально)
```
/setmenubutton
```
Выберите бота → введите URL → задайте текст кнопки "Финансы 💸"

---

## Структура проекта

```
src/
├── components/
│   ├── Home.jsx          # Главная: бюджет, расходы, дневной лимит
│   ├── Analytics.jsx     # Аналитика по категориям и нужное/ненужное
│   ├── Savings.jsx       # Накопления и компенсации
│   ├── Settings.jsx      # Настройки бюджета и валюты
│   └── AddExpenseModal.jsx # Модалка добавления расхода
├── hooks/
│   └── useTelegram.js    # Хук для Telegram WebApp SDK
├── store/
│   └── useStore.js       # Стейт + localStorage персистентность
├── utils/
│   └── format.js         # Форматирование чисел и дат
├── App.jsx               # Роутинг, навигация
├── main.jsx
└── index.css             # Все стили (CSS variables, dark theme)
```

---

## Технологии

| Технология | Версия | Зачем |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Сборщик |
| Telegram WebApp JS | latest | SDK для Telegram |
| lucide-react | 0.383 | Иконки |
| localStorage | — | Персистентность данных |

> Данные хранятся в `localStorage` устройства. При очистке данных браузера — данные удаляются.

---

## Кастомизация

### Изменить цвета
В `src/index.css` отредактируйте CSS-переменные в `:root`:
```css
--accent: #b8ff65;   /* Основной акцентный цвет */
--bg: #0e0e0f;       /* Фон */
```

### Добавить категории
В `src/store/useStore.js`, массив `DEFAULT_CATEGORIES`:
```js
{ id: 'gym', emoji: '🏋️', name: 'Спорт', color: '--teal' },
```

### Поменять валюту по умолчанию
В `src/store/useStore.js`:
```js
budget: { monthly: 0, currency: '$' },
```
