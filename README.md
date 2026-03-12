# CodeLeap Network

Frontend implementation of the CodeLeap engineering test using React, TypeScript, Vite, React Query, Tailwind, Zustand, and optional Firebase authentication.

## Core Requirements

- Username-first entry flow that matches the PDF requirement
- Create, read, update, and delete posts using the CodeLeap API
- Edit and delete actions only for posts created by the current username
- Automatic list refresh after create, update, and delete
- Most recent posts shown first by default

## Bonus Features

- Likes
- Comments
- Mentions with highlighted `@username`
- Optional Google authentication with Firebase
- Sorting and filtering controls
- Image attachments for posts
- Responsive mobile layout
- Persistent username session and optional auth session
- Infinite scroll
- Hover states and motion transitions

## Environment

Create a `.env.local` file using `.env.example`.

Firebase is optional. If the Firebase variables are not configured, the app still works and simply hides the Google auth action.

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_BASE_URL=https://dev.codeleap.co.uk/careers/
```

## Run

```bash
npm install
npm run dev
```

## Validate

```bash
npm run build
npm run lint
```

## Notes

- Post attachments, likes, and comments are frontend-only extras persisted locally.
- Core posts are fetched from the public CodeLeap endpoint, so posted content is visible to other applicants.
- The provided API requires trailing slashes for update and delete requests.
