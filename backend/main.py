import os
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import httpx
from astral import Observer
from astral.moon import moonrise, moonset, phase as moon_phase
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles


# ============================================================
# CONFIG
# ============================================================

app = FastAPI()


OPEN_METEO_URL = (
    "https://api.open-meteo.com/v1/forecast"
)


# Default location: London
LATITUDE = float(
    os.getenv(
        "WEATHER_LATITUDE",
        "51.5074",
    )
)

LONGITUDE = float(
    os.getenv(
        "WEATHER_LONGITUDE",
        "-0.1278",
    )
)

LOCATION_NAME = os.getenv(
    "WEATHER_LOCATION",
    "London",
)


# ============================================================
# HELPERS
# ============================================================

def nearest_hour_index(
    times,
    current_time,
):
    """
    Find the hourly forecast entry closest
    to the API's current weather timestamp.
    """

    if not times:
        return 0

    try:
        current_dt = datetime.fromisoformat(
            current_time
        )
    except Exception:
        return 0

    best_index = 0
    best_difference = None

    for index, value in enumerate(times):
        try:
            hour_dt = datetime.fromisoformat(
                value
            )

            difference = abs(
                (
                    hour_dt
                    - current_dt
                ).total_seconds()
            )

            if (
                best_difference is None
                or difference < best_difference
            ):
                best_difference = difference
                best_index = index

        except Exception:
            continue

    return best_index


def pressure_direction(
    current_pressure,
    previous_pressure,
):
    """
    Simple 3-hour pressure tendency.

    +/- 1 hPa is treated as meaningful.
    """

    if (
        current_pressure is None
        or previous_pressure is None
    ):
        return "steady"

    change = (
        float(current_pressure)
        - float(previous_pressure)
    )

    if change >= 1:
        return "rising"

    if change <= -1:
        return "falling"

    return "steady"


def get_moon_data(
    latitude,
    longitude,
    timezone_name,
    local_date,
):
    """
    Calculate moon phase, moonrise and
    moonset locally using Astral.
    """

    observer = Observer(
        latitude=latitude,
        longitude=longitude,
    )

    timezone = ZoneInfo(
        timezone_name
    )

    # Astral phase is approximately
    # 0 -> 27.99.
    phase_days = moon_phase(
        local_date
    )

    phase_fraction = (
        phase_days / 28.0
    ) % 1.0


    try:
        rise = moonrise(
            observer,
            date=local_date,
            tzinfo=timezone,
        )

        rise_value = (
            rise.isoformat(
                timespec="minutes"
            )
            if rise
            else None
        )

    except ValueError:
        rise_value = None


    try:
        setting = moonset(
            observer,
            date=local_date,
            tzinfo=timezone,
        )

        set_value = (
            setting.isoformat(
                timespec="minutes"
            )
            if setting
            else None
        )

    except ValueError:
        set_value = None


    return {
        "phase": phase_fraction,
        "moonrise": rise_value,
        "moonset": set_value,
    }


# ============================================================
# WEATHER API
# ============================================================

@app.get("/api/weather")
async def weather():
    params = {
        "latitude": LATITUDE,
        "longitude": LONGITUDE,

        "current": ",".join([
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "weather_code",
            "cloud_cover",
            "is_day",
            "pressure_msl",
            "wind_speed_10m",
            "wind_direction_10m",
            "wind_gusts_10m",
            "precipitation",
        ]),

        "hourly": ",".join([
            "precipitation_probability",
            "precipitation",
            "pressure_msl",
            "uv_index",
        ]),

        "daily": ",".join([
            "weather_code",
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_probability_max",
            "precipitation_sum",
            "uv_index_max",
            "sunrise",
            "sunset",
        ]),

        "timezone": "auto",

        # IMPORTANT:
        # Today + seven following days.
        "forecast_days": 8,
    }


    async with httpx.AsyncClient(
        timeout=15.0
    ) as client:
        response = await client.get(
            OPEN_METEO_URL,
            params=params,
        )

        response.raise_for_status()

        data = response.json()


    current = data.get(
        "current",
        {}
    )

    hourly = data.get(
        "hourly",
        {}
    )

    daily = data.get(
        "daily",
        {}
    )


    timezone_name = data.get(
        "timezone",
        "Europe/London",
    )


    # ========================================================
    # CURRENT HOURLY INDEX
    # ========================================================

    hourly_times = hourly.get(
        "time",
        []
    )

    current_time = current.get(
        "time"
    )

    current_hour_index = (
        nearest_hour_index(
            hourly_times,
            current_time,
        )
    )


    # ========================================================
    # PRESSURE TREND
    # ========================================================

    hourly_pressure = hourly.get(
        "pressure_msl",
        []
    )

    current_pressure = current.get(
        "pressure_msl"
    )


    previous_pressure = None

    if hourly_pressure:
        previous_index = max(
            0,
            current_hour_index - 3,
        )

        if (
            previous_index
            < len(hourly_pressure)
        ):
            previous_pressure = (
                hourly_pressure[
                    previous_index
                ]
            )


    pressure_trend = (
        pressure_direction(
            current_pressure,
            previous_pressure,
        )
    )


    # ========================================================
    # CURRENT UV
    # ========================================================

    hourly_uv = hourly.get(
        "uv_index",
        []
    )

    current_uv = 0

    if (
        hourly_uv
        and current_hour_index
        < len(hourly_uv)
    ):
        current_uv = (
            hourly_uv[
                current_hour_index
            ]
            or 0
        )


    # ========================================================
    # TODAY
    # ========================================================

    daily_times = daily.get(
        "time",
        []
    )

    today_string = (
        daily_times[0]
        if daily_times
        else datetime.now().date().isoformat()
    )


    local_date = (
        datetime.fromisoformat(
            today_string
        ).date()
    )


    # ========================================================
    # UV MAX TIME TODAY
    # ========================================================

    uv_max = 0

    daily_uv_max = daily.get(
        "uv_index_max",
        []
    )

    if daily_uv_max:
        uv_max = (
            daily_uv_max[0]
            or 0
        )


    uv_max_time = None

    today_uv_entries = []

    for index, time_value in enumerate(
        hourly_times
    ):
        if not time_value.startswith(
            today_string
        ):
            continue

        if index >= len(hourly_uv):
            continue

        value = hourly_uv[index]

        if value is None:
            continue

        today_uv_entries.append(
            (
                index,
                float(value),
            )
        )


    if today_uv_entries:
        uv_index, _ = max(
            today_uv_entries,
            key=lambda item: item[1],
        )

        uv_max_time = (
            hourly_times[
                uv_index
            ]
        )


    # ========================================================
    # PRECIPITATION GRAPH
    # Next ~24 hours, sampled every 3 hours
    # ========================================================

    hourly_probability = hourly.get(
        "precipitation_probability",
        []
    )

    hourly_precipitation = hourly.get(
        "precipitation",
        []
    )


    precip_chart = []


    end_index = min(
        current_hour_index + 24,
        len(hourly_times),
    )


    for index in range(
        current_hour_index,
        end_index,
        3,
    ):
        probability = 0
        precipitation = 0


        if (
            index
            < len(
                hourly_probability
            )
        ):
            probability = (
                hourly_probability[
                    index
                ]
                or 0
            )


        if (
            index
            < len(
                hourly_precipitation
            )
        ):
            precipitation = (
                hourly_precipitation[
                    index
                ]
                or 0
            )


        precip_chart.append({
            "time":
                hourly_times[
                    index
                ],

            "probability":
                probability,

            "precipitation":
                precipitation,
        })


    # ========================================================
    # 8-DAY FORECAST
    #
    # IMPORTANT:
    # Do NOT use range(7) or [:7].
    # ========================================================

    weekly = []


    weather_codes = daily.get(
        "weather_code",
        []
    )

    highs = daily.get(
        "temperature_2m_max",
        []
    )

    lows = daily.get(
        "temperature_2m_min",
        []
    )

    rain_chances = daily.get(
        "precipitation_probability_max",
        []
    )

    precipitation_totals = daily.get(
        "precipitation_sum",
        []
    )


    day_count = min(
        8,
        len(daily_times),
    )


    for index in range(
        day_count
    ):
        weekly.append({
            "date":
                daily_times[
                    index
                ],

            "weather_code":
                (
                    weather_codes[
                        index
                    ]
                    if index
                    < len(
                        weather_codes
                    )
                    else 0
                ),

            "high":
                (
                    highs[
                        index
                    ]
                    if index
                    < len(highs)
                    else 0
                ),

            "low":
                (
                    lows[
                        index
                    ]
                    if index
                    < len(lows)
                    else 0
                ),

            "rain_chance":
                (
                    rain_chances[
                        index
                    ]
                    if index
                    < len(
                        rain_chances
                    )
                    else 0
                ),

            "precipitation_total":
                (
                    precipitation_totals[
                        index
                    ]
                    if index
                    < len(
                        precipitation_totals
                    )
                    else 0
                ),
        })


    # ========================================================
    # MOON
    # ========================================================

    moon = get_moon_data(
        LATITUDE,
        LONGITUDE,
        timezone_name,
        local_date,
    )


    # ========================================================
    # TODAY DAILY VALUES
    # ========================================================

    today_high = (
        highs[0]
        if highs
        else current.get(
            "temperature_2m",
            0,
        )
    )

    today_low = (
        lows[0]
        if lows
        else current.get(
            "temperature_2m",
            0,
        )
    )


    today_rain_chance = (
        rain_chances[0]
        if rain_chances
        else 0
    )


    today_precip_total = (
        precipitation_totals[0]
        if precipitation_totals
        else 0
    )


    sunrise_values = daily.get(
        "sunrise",
        []
    )

    sunset_values = daily.get(
        "sunset",
        []
    )


    sunrise = (
        sunrise_values[0]
        if sunrise_values
        else None
    )

    sunset = (
        sunset_values[0]
        if sunset_values
        else None
    )


    # ========================================================
    # NORMALISED RESPONSE
    # ========================================================

    return {
        "location":
            LOCATION_NAME,

        "timezone":
            timezone_name,

        "updated_at":
            current_time,

        "temperature":
            current.get(
                "temperature_2m",
                0,
            ),

        "feels_like":
            current.get(
                "apparent_temperature",
                0,
            ),

        "humidity":
            current.get(
                "relative_humidity_2m",
                0,
            ),

        "weather_code":
            current.get(
                "weather_code",
                0,
            ),

        "cloud_cover":
            current.get(
                "cloud_cover",
                0,
            ),

        "is_day":
            bool(
                current.get(
                    "is_day",
                    1,
                )
            ),

        "pressure":
            current_pressure,

        "pressure_trend":
            pressure_trend,

        "wind_speed":
            current.get(
                "wind_speed_10m",
                0,
            ),

        "wind_direction":
            current.get(
                "wind_direction_10m",
                0,
            ),

        "wind_gusts":
            current.get(
                "wind_gusts_10m",
                0,
            ),

        "precipitation_now":
            current.get(
                "precipitation",
                0,
            ),

        "high":
            today_high,

        "low":
            today_low,

        "rain_chance":
            today_rain_chance,

        "precipitation_total":
            today_precip_total,

        "uv":
            current_uv,

        "uv_max":
            uv_max,

        "uv_max_time":
            uv_max_time,

        "sunrise":
            sunrise,

        "sunset":
            sunset,

        "moon_phase":
            moon[
                "phase"
            ],

        "moonrise":
            moon[
                "moonrise"
            ],

        "moonset":
            moon[
                "moonset"
            ],

        "precip_chart":
            precip_chart,

        "weekly":
            weekly,
    }


# ============================================================
# FRONTEND STATIC FILES
# ============================================================

PROJECT_ROOT = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)

FRONTEND_DIST = (
    PROJECT_ROOT
    / "frontend"
    / "dist"
)


if FRONTEND_DIST.exists():
    app.mount(
        "/",
        StaticFiles(
            directory=FRONTEND_DIST,
            html=True,
        ),
        name="frontend",
    )