# AI Portfolio Project

Современный сайт-портфолио для AI-инженера на стеке React + Vite + Tailwind CSS + Firebase.

## Установка и запуск

1.  **Установите зависимости:**
    Откройте терминал в папке проекта и выполните:
    ```bash
    npm install
    ```

2.  **Запустите локальный сервер:**
    ```bash
    npm run dev
    ```
    Сайт будет доступен по адресу `http://localhost:5173`.

3.  **Сборка для продакшена:**
    ```bash
    npm run build
    ```

## Настройка Firebase

Для работы админ-панели и динамических данных:

1. Создайте проект в [Firebase Console](https://console.firebase.google.com/).
2. Создайте Web App и скопируйте конфигурацию.
3. Обновите файл `firebase.ts` или создайте файл `.env.local` в корне проекта с вашими ключами:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Структура

*   `components/` - React компоненты
*   `types.ts` - TypeScript интерфейсы
*   `constants.tsx` - Статические данные (если база данных не подключена)
*   `styles.css` - Глобальные стили
