# Messenger

Веб-приложение — интерактивный чат для обмена сообщениями в реальном времени, аналог Telegram.  
Учебный проект курса «Мидл фронтенд-разработчик» от Яндекс Практикума.

## Дизайн

[Макет в Figma](https://www.figma.com/design/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=0-1&t=acLSkgxvZKVJaekD-0)

## Функциональность

- Регистрация и авторизация пользователей
- Список чатов с поиском
- Обмен сообщениями в реальном времени по WebSocket: история сообщений (`get old`), отправка/получение, ping/pong каждые 25 секунд для поддержания соединения
- Список участников чата (имя, логин, ID) во всплывающем поповере по клику на счётчик
- Настройки профиля (аватар, данные пользователя, смена пароля)
- Создание и удаление чатов
- Добавление / удаление пользователей в чате
- Страницы ошибок 404 и 500; автоматический редирект на `/500` при `5xx` или сетевой ошибке HTTP-запроса
- Защита от XSS: автоэкранирование Handlebars + строгий `Content-Security-Policy` и набор security-заголовков на Netlify

## Технологии

- **TypeScript** — типизация и надёжность кода
- **Handlebars** — шаблонизация компонентов
- **Sass (SCSS)** — препроцессор стилей
- **Vite** — сборка и dev-сервер
- **WebSocket API** — двусторонний обмен сообщениями с сервером чатов
- **Jest + ts-jest + jsdom** — модульные тесты фреймворка и компонентов
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

| Команда                | Описание                                                    |
| ---------------------- | ----------------------------------------------------------- |
| `npm run start`        | Запуск dev-сервера Vite с HMR                               |
| `npm run build`        | Сборка проекта (TypeScript + Vite)                          |
| `npm run preview`      | Локальный просмотр production-сборки                        |
| `npm run lint`         | Проверка кода ESLint                                        |
| `npm run lint:fix`     | Автофикс линтером                                           |
| `npm run lint:css`     | Проверка стилей Stylelint                                   |
| `npm run lint:css:fix` | Автофикс стилей                                             |
| `npm run test`         | Запуск Jest-тестов (фреймворк, утилиты, базовые компоненты) |
| `npm run test:watch`   | Jest в watch-режиме                                         |

## Тестирование

Используется Jest c `ts-jest` и средой `jsdom`. Тесты лежат рядом с тестируемыми
модулями в подпапках `tests/`:

- `src/framework/tests/` — `block.test.ts`, `router.test.ts`, `route.test.ts`, `api.test.ts`.
- `src/components/tests/` — `button.test.ts`, `input.test.ts`, `avatar.test.ts`, `userCard.test.ts`, `searchInput.test.ts`, `modal.test.ts`.

Запуск:

```bash
npm run test          # один прогон
npm run test:watch    # в watch-режиме
```

## Структура проекта

```
src/
├── components/       # Переиспользуемые UI-компоненты (Handlebars + TypeScript)
├── pages/            # Страницы приложения (Chat, Login, Register, Profile и т.д.)
├── framework/        # Собственный мини-фреймворк: Block, Router, Store, HTTP-транспорт
├── entities/         # Типы и интерфейсы предметной области (по доменам)
├── composables/      # Чистые функции: парсинг ответов API и маппинг данных в UI-props
├── utils/            # Общие утилиты (валидация форм и т.п.)
├── App.ts            # Корневой компонент приложения
├── main.ts           # Точка входа
├── style.scss        # Базовые стили
```

### Соглашения по папкам

- **`entities/`** — только типы/интерфейсы предметной области. Один тип — один файл в PascalCase, реэкспорт через `index.ts` подпапки.
- **`composables/`** — только чистые функции (без обращения к DOM/стору/API). Один файл — одна функция с именем функции, с JSDoc-комментарием о назначении. Реэкспорт через `index.ts`.
- **`framework/`** — переиспользуемая инфраструктура, не зависящая от конкретных страниц.
- **`components/` и `pages/`** — каждый компонент/страница в своей папке: `*.tmpl.ts` (класс + шаблон), `*.scss` (стили), `*.api.ts` (при необходимости), `index.ts` для реэкспорта.

## WebSocket-чат

Соединение поднимается через `ChatWebSocket` (`src/framework/chatSocket.ts`)
по адресу `wss://ya-praktikum.tech/ws/chats/{userId}/{chatId}/{token}`. Cookie
авторизации браузер прицепляет к WS-handshake автоматически (origin совпадает
с REST API).

Что делает обёртка:

- открывает соединение по токену, полученному из `POST /chats/token/{chatId}`;
- после `open` отправляет `{ "type": "get old", "content": "0" }` — сервер
  возвращает массив с историей сообщений;
- каждые 25 секунд отправляет `{ "type": "ping" }`, чтобы держать сокет живым;
- ответы `{ "type": "pong" }` глушит, в `onMessage` пробрасывает уже
  распарсенный JSON;
- входящие сообщения мерджатся в `store.messages.{chatId}` с дедупом по `id`,
  селектор `mapChatPageToProps` собирает их в `activeChat.messages` с
  разделителями дат и `isOwn`-флагом;
- при отправке формы вызывается `chatSocket.sendJson({ type: 'message', content })`,
  сервер эхом возвращает сообщение всем клиентам, и оно через тот же стор
  попадает в UI.

## Безопасность

- В шаблонах используется только `{{ }}` — Handlebars автоматически экранирует
  HTML, тройные фигурные скобки `{{{ }}}` нигде не применяются.
- В `netlify.toml` настроены security-заголовки: `Content-Security-Policy`
  (whitelist собственного origin + `https://ya-praktikum.tech` и
  `wss://ya-praktikum.tech`), `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`.

## Netlify

Развёрнутое приложение: *(https://stirring-smakager-3c2331.netlify.app/)*

