# Messenger

Веб-приложение — интерактивный чат для обмена сообщениями в реальном времени, аналог Telegram.  
Учебный проект курса «Мидл фронтенд-разработчик» от Яндекс Практикума.

## Дизайн

[Макет в Figma](https://www.figma.com/design/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0-1&t=acLSkgxvZKVJaekD-0)

## Функциональность

- Регистрация и авторизация пользователей
- Список чатов с поиском
- Обмен сообщениями в реальном времени
- Настройки профиля (аватар, данные пользователя, смена пароля)
- Создание и удаление чатов
- Добавление / удаление пользователей в чате

## Технологии

- **TypeScript** — типизация и надёжность кода
- **Handlebars** — шаблонизация компонентов
- **Sass (SCSS)** — препроцессор стилей
- **Vite** — сборка и dev-сервер
- **ESLint / Stylelint** — линтинг кода и стилей

## Установка и запуск

```bash
# Клонировать репозиторий
git clone https://github.com/JaySeven22/middle.messenger.praktikum.yandex.git
cd middle.messenger.praktikum.yandex

# Установить зависимости
npm install

# Запустить dev-сервер (по умолчанию http://localhost:3000)
npm run start

# Собрать проект для продакшена
npm run build

# Запустить превью собранной версии
npm run preview
```

## Команды

| Команда           | Описание                                |
| ----------------- | --------------------------------------- |
| `npm run dev`     | Запуск dev-сервера с HMR               |
| `npm run start`   | Алиас для `dev`                         |
| `npm run build`   | Сборка проекта (TypeScript + Vite)      |
| `npm run preview` | Локальный просмотр production-сборки    |

## Структура проекта

```
src/
├── components/       # UI-компоненты (Handlebars + TypeScript)
├── pages/            # Страницы приложения
├── utils/            # Утилиты и хелперы
├── styles/           # Глобальные SCSS-стили
├── main.ts           # Точка входа
└── style.css         # Базовые стили
```

## Netlify

Развёрнутое приложение: *(https://stirring-smakager-3c2331.netlify.app/)*

