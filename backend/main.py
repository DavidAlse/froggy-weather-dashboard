import os
from pathlib import Path

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Froggy Weather Dashboard")

# Change these defaults, or override them with environment variables.
LOCATION_NAME = os.getenv("DASHBOARD_LOCATION", "London")
LATITUDE = float(os.getenv("DASHBOARD_LAT", "51.5074"))
LONGITUDE = float(os.getenv("DASHBOARD_LON", "-0.1278"))

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


@app.get("/api/weather")
async def weather():
    params = {
        "latitude": LATITUDE,
        "longitude": LONGITUDE,
        "timezone": "auto",
        "forecast_days": 1,
        "current": ",".join(
            [
                "temperature_2m",
                "apparent_temperature",
                "weather_code",
                "is_day",
                "pressure_msl",
                "wind_speed_10m",
                "wind_direction_10m",
                "wind_gusts_10m",
                "precipitation",
                "cloud_cover",
            ]
        ),
        "daily": ",".join(
            [
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_probability_max",
                "uv_index_max",
                "sunrise",
                "sunset",
            ]
        ),
    }

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(OPEN_METEO_URL, params=params)
            response.raise_for_status()
            raw = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise HTTPException(status_code=502, detail="Could not fetch weather data") from exc

    current = raw["current"]
    daily = raw["daily"]

    return {
        "location": LOCATION_NAME,
        "timezone": raw.get("timezone"),
        "updated_at": current["time"],
        "temperature": current["temperature_2m"],
        "feels_like": current["apparent_temperature"],
        "weather_code": current["weather_code"],
        "cloud_cover": current.get("cloud_cover"),
        "is_day": bool(current["is_day"]),
        "pressure": current["pressure_msl"],
        "wind_speed": current["wind_speed_10m"],
        "wind_direction": current["wind_direction_10m"],
        "wind_gusts": current["wind_gusts_10m"],
        "precipitation_now": current["precipitation"],
        "high": daily["temperature_2m_max"][0],
        "low": daily["temperature_2m_min"][0],
        "rain_chance": daily["precipitation_probability_max"][0],
        "uv_max": daily["uv_index_max"][0],
        "sunrise": daily["sunrise"][0],
        "sunset": daily["sunset"][0],
    }


# After `npm run build`, serve the React app from FastAPI too.
dist_dir = Path(__file__).resolve().parent.parent / "frontend" / "dist"
if dist_dir.exists():
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="frontend")
