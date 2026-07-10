# biz-track

Lightweight POS (point-of-sale) and inventory tracking app built with Django (backend) and Vite + React (frontend).

---

## Overview

This repo contains the backend Django project (`backend/`) and a Vite + React frontend (`frontend/`). The app uses SQLite by default for local development and exposes a JSON API under `/api/`.

## Tech stack

- Backend: Python, Django, Django REST Framework
- Frontend: React, Vite
- Database: SQLite (default, `backend/db.sqlite3`)

## Prerequisites

- Node >= 16 and npm (or yarn)
- Python 3.8+
- Git (optional)

## Backend — quick start

1. Open a terminal and change to the backend folder:

```powershell
cd backend
```

2. Create and activate a virtual environment (Windows example):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install Python dependencies (expects a `requirements.txt` in `backend/`):

```powershell
pip install -r requirements.txt
```

4. Apply migrations and create a superuser:

```powershell
python manage.py migrate
python manage.py createsuperuser
```

5. Run the development server:

```powershell
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/api/` by default. The SQLite file is `backend/db.sqlite3`.

## Frontend — quick start

1. Change to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
# yarn
```

3. Run the dev server:

```bash
npm run dev
```

The frontend dev server (Vite) will typically run at `http://localhost:5173/` (check the terminal output).

To build for production:

```bash
npm run build
npm run preview
```

## Environment and configuration

- Backend: if you use environment variables, add a `.env` file or set them in your shell. Example variables: `DJANGO_SECRET_KEY`, `DATABASE_URL` (if switching DB), `DEBUG=1`.
- Frontend: update API base URLs in `frontend/src/utils/auth.js` or relevant config files when pointing to a different API host.

## Running tests

- Backend Django tests:

```powershell
cd backend
python manage.py test
```

- Frontend tests: run whatever test runner is configured (e.g., `npm test`) from `frontend/`.

## Project structure (high level)

- `backend/` — Django project and apps (users, products, sales, purchases, dashboard, core)
  - `manage.py` — Django management entrypoint
  - `db.sqlite3` — default development database
  - `config/` — Django settings, urls, wsgi/asgi
  - apps: `products/`, `sales/`, `purchases/`, `users/`, `dashboard/`, `core/`
- `frontend/` — React + Vite app
  - `src/` — React source
  - `src/components/` — UI components (Sidebar, Layout, DashboardCard, etc.)
  - `src/pages/` — main pages (Dashboard, Products, Sales...)

## API examples

The project exposes REST endpoints under `/api/`. Example used in the frontend:

- `GET /api/dashboard/` — returns metrics and lists such as `recent_sales`, `low_stock` (used by the dashboard page).

Explore `backend/` apps and `backend/urls.py` to discover additional endpoints (products, purchases, sales, auth).

## Notes

- This project is configured for local development. For production, configure a proper database (Postgres), static files, secret management, and a production-ready web server.
- If you change the API host or port, update the frontend's API helper in `frontend/src/utils/auth.js`.

## Contributing

1. Fork, branch, implement, and open a pull request.
2. Keep changes focused and include tests for backend logic when applicable.

## License

Add your preferred license or keep proprietary — this file does not include a license by default.

---

If you'd like, I can add a `backend/requirements.txt` template, an `.env.example`, or extend the README with deployment steps. Let me know which you'd prefer next.