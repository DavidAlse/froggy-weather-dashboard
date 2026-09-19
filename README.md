# Froggy Weather Dashboard

A small Raspberry Pi-friendly weather dashboard:

- React + Vite frontend
- FastAPI Python backend
- Open-Meteo weather data
- Designed to run full-screen in Chromium kiosk mode later

## 1. Backend

Open a terminal in this folder:

```bash
cd backend
python -m venv .venv
```

Activate it:

**Windows PowerShell**
```powershell
.venv\Scripts\Activate.ps1
```

**macOS / Linux / Raspberry Pi**
```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run:

```bash
uvicorn main:app --reload --port 8000
```

Test:

http://localhost:8000/api/weather

## 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

http://localhost:5173

Vite proxies `/api` requests to FastAPI on port 8000.

## Change location

The starter defaults to London.

Set these environment variables before running the backend:

```bash
DASHBOARD_LOCATION="Auckland"
DASHBOARD_LAT="-36.8509"
DASHBOARD_LON="174.7645"
```

Or edit the defaults at the top of `backend/main.py`.

## Production build

Build the frontend:

```bash
cd frontend
npm run build
```

Then run FastAPI from the backend folder:

```bash
cd ../backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

If `frontend/dist` exists, FastAPI also serves the finished dashboard at:

http://localhost:8000

That URL is suitable for Chromium kiosk mode on the Pi.


## Froggy images

Sourced from https://github.com/sga-noud/google-weather-frog