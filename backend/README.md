# Datanews Backend (Express + MongoDB)

## 1. Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

## 2. Base URL

- `http://localhost:5000/api`

## 3. Health check

- `GET /api/health`

## 4. Auth endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me` (Bearer token)

## 5. Content endpoints

- `GET /api/posts`
- `GET /api/posts/:id`
- `POST /api/posts` (Bearer)
- `PATCH /api/posts/:id` (Bearer)
- `DELETE /api/posts/:id` (Bearer)
- `GET /api/posts/:id/comments`
- `POST /api/posts/:id/comments` (Bearer)
- `POST /api/posts/:id/bookmark` (Bearer)
- `GET /api/posts/bookmarks/me` (Bearer)
- `GET /api/categories`
- `POST /api/categories` (Admin)
- `GET /api/topics`
- `POST /api/topics` (Admin)

## Notes

- This is an MVP scaffold for your current frontend.
- Next step: add likes/follows/notifications/admin analytics endpoints and validation layer.
