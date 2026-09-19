import { useEffect, useState } from "react";

/* ==================================================
   CONFIG
================================================== */

const FROG_FORMAT =
  (import.meta.env.VITE_FROG_FORMAT ?? "wide").toLowerCase() === "square"
    ? "square"
    : "wide";

const PRECIP_THRESHOLD = 20;

/* ==================================================
   WEATHER LABELS
================================================== */

const WEATHER = {
  0: ["Clear", "☀️"],
  1: ["Mostly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],

  45: ["Fog", "🌫️"],
  48: ["Fog", "🌫️"],

  51: ["Drizzle", "🌦️"],
  53: ["Drizzle", "🌦️"],
  55: ["Drizzle", "🌧️"],

  56: ["Freezing drizzle", "🌧️"],
  57: ["Freezing drizzle", "🌧️"],

  61: ["Rain", "🌦️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],

  66: ["Freezing rain", "🌧️"],
  67: ["Freezing rain", "🌧️"],

  71: ["Light snow", "🌨️"],
  73: ["Snow", "❄️"],
  75: ["Heavy snow", "❄️"],
  77: ["Snow", "❄️"],

  80: ["Rain showers", "🌦️"],
  81: ["Rain showers", "🌧️"],
  82: ["Heavy showers", "🌧️"],

  85: ["Snow showers", "🌨️"],
  86: ["Heavy snow showers", "❄️"],

  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm", "⛈️"],
  99: ["Thunderstorm", "⛈️"],
};

/* ==================================================
   SQUARE FROG BACKUP
================================================== */

const scenes = (value) =>
  value.trim().split(/\s+/);

const SQUARE_SCENES = {
  "01": scenes(`
    01-sunny-beach-reading
    01-sunny-beach-sandcastle
    01-sunny-beach-sunscreen
    01-sunny-citypark-picnic
    01-sunny-creek-swimming
    01-sunny-field-biking
    01-sunny-field-hiking
    01-sunny-field-kite
    01-sunny-hills-painting
    01-sunny-hills-reading
    01-sunny-hills-sunbathing
    01-sunny-home-laundry
    01-sunny-orchard-pickingfruit
    01-sunny-rooftop-pinacolada
  `),

  "02": scenes(`
    02-mostly-sunny-beach-reading
    02-mostly-sunny-beach-sandcastle
    02-mostly-sunny-beach-sunscreen
    02-mostly-sunny-citypark-picnic
    02-mostly-sunny-creek-swimming
    02-mostly-sunny-field-biking
    02-mostly-sunny-field-hiking
    02-mostly-sunny-field-kite
    02-mostly-sunny-hills-painting
    02-mostly-sunny-hills-reading
    02-mostly-sunny-hills-sunbathing
    02-mostly-sunny-home-laundry
    02-mostly-sunny-orchard-pickingfruit
    02-mostly-sunny-rooftop-pinacolada
  `),

  "03": scenes(`
    03-partly-cloudy-day-beach-shells
    03-partly-cloudy-day-citypark-ukelele
    03-partly-cloudy-day-creek-feet
    03-partly-cloudy-day-field-biking
    03-partly-cloudy-day-field-hiking
    03-partly-cloudy-day-hills-painting
    03-partly-cloudy-day-hills-reading
    03-partly-cloudy-day-home-flowers
    03-partly-cloudy-day-orchard-butterflies
    03-partly-cloudy-day-orchard-treeswing
  `),

  "04": scenes(`
    04-mostly-cloudy-day-beach-shells
    04-mostly-cloudy-day-citypark-ukelele
    04-mostly-cloudy-day-creek-feet
    04-mostly-cloudy-day-field-biking
    04-mostly-cloudy-day-field-hiking
    04-mostly-cloudy-day-hills-painting
    04-mostly-cloudy-day-hills-reading
    04-mostly-cloudy-day-home-flowers
    04-mostly-cloudy-day-orchard-butterflies
    04-mostly-cloudy-day-orchard-treeswing
  `),

  "05": scenes(`
    05-clear-creek-stars
    05-clear-field-lanterns
    05-clear-hills-camping
    05-clear-hills-telescope
    05-clear-home-lounging
    05-clear-orchard-fireflies
  `),

  "06": scenes(`
    06-mostly-clear-creek-stars
    06-mostly-clear-field-lanterns
    06-mostly-clear-hills-camping
    06-mostly-clear-hills-telescope
    06-mostly-clear-home-lounging
    06-mostly-clear-orchard-fireflies
  `),

  "07": scenes(`
    07-partly-cloudy-night-creek-fireflies
    07-partly-cloudy-night-field-fireflies
    07-partly-cloudy-night-hills-smores
    07-partly-cloudy-night-home-inside
    07-partly-cloudy-night-orchard-eating
    07-partly-cloudy-night-rooftop-dinner
  `),

  "08": scenes(`
    08-mostly-cloudy-night-creek-fireflies
    08-mostly-cloudy-night-field-fireflies
    08-mostly-cloudy-night-hills-smores
    08-mostly-cloudy-night-home-inside
    08-mostly-cloudy-night-orchard-eating
    08-mostly-cloudy-night-rooftop-dinner
  `),

  "09": scenes(`
    09-cloudy-hills-coffee
    09-cloudy-home-flowers
    09-cloudy-orchard-watching
  `),

  "10": scenes(`
    10-drizzle-creek-leaf
    10-drizzle-field-leaf
    10-drizzle-hills-umbrella
    10-drizzle-home-laundry
    10-drizzle-orchard-reading
  `),

  "11": scenes(`
    11-rain-creek-leaf
    11-rain-field-leaf
    11-rain-hills-umbrella
    11-rain-home-laundry
    11-rain-orchard-reading
  `),

  "12": scenes(`
    12-heavy-rain-busstop-umbrella
    12-heavy-rain-creek-leaf
  `),

  "13": scenes(`
    13-flurries-citypark-snowman
    13-flurries-creek-iceskating
  `),

  "15": scenes(`
    15-snow-showers-snow-citypark-snowman
    15-snow-showers-snow-creek-skating
    15-snow-showers-snow-home-shoveling
  `),

  "16": scenes(`
    16-blowing-snow-field-snowman
  `),

  "17": scenes(`
    17-heavy-snow-blizzard-creek-cocoa
    17-heavy-snow-blizzard-home-inside
    17-heavy-snow-blizzard-home-shoveling
  `),

  "19": scenes(`
    19-mixed-rain-hail-rain-sleet-busstop-waiting
    19-mixed-rain-hail-rain-sleet-cafe-entering
  `),

  "20": scenes(`
    20-rain-snow-wintry-mix-citypark-snowman
  `),

  "25": scenes(`
    25-breezy-windy-creek-pinwheel
    25-breezy-windy-home-laundry
  `),

  "26": scenes(`
    26-haze-fog-dust-smoke-field-lantern
  `),
};

const SQUARE_FALLBACK = {
  "22": "12",
  "24": "19",
};

/* ==================================================
   HELPERS
================================================== */

function weatherInfo(code) {
  return WEATHER[Number(code)] ?? ["Weather", "🌦️"];
}

function formatTime(value) {
  const match =
    String(value ?? "").match(
      /T(\d{2}):(\d{2})/
    );

  if (!match) {
    return "—";
  }

  const hour24 =
    Number(match[1]);

  const hour12 =
    hour24 % 12 || 12;

  const suffix =
    hour24 >= 12
      ? "PM"
      : "AM";

  return `${hour12}:${match[2]} ${suffix}`;
}

function formatHour(value) {
  const match =
    String(value ?? "").match(
      /T(\d{2}):/
    );

  if (!match) {
    return "—";
  }

  return `${match[1]}:00`;
}

function formatDay(value) {
  if (!value) {
    return "—";
  }

  const date =
    new Date(
      `${value}T12:00:00`
    );

  return date.toLocaleDateString(
    undefined,
    {
      weekday: "short",
    }
  );
}

function compass(degrees) {
  if (
    degrees == null ||
    Number.isNaN(
      Number(degrees)
    )
  ) {
    return "—";
  }

  const directions = [
    "N",
    "NE",
    "E",
    "SE",
    "S",
    "SW",
    "W",
    "NW",
  ];

  return directions[
    Math.round(
      Number(degrees) / 45
    ) % 8
  ];
}

function moonPhaseEmoji(value) {
  if (
    value == null ||
    Number.isNaN(
      Number(value)
    )
  ) {
    return "🌙";
  }

  const phases = [
    "🌑",
    "🌒",
    "🌓",
    "🌔",
    "🌕",
    "🌖",
    "🌗",
    "🌘",
  ];

  const phase =
    (
      (
        Number(value)
        % 1
      )
      + 1
    )
    % 1;

  return phases[
    Math.round(
      phase * 8
    ) % 8
  ];
}

/* ==================================================
   FROG CATEGORY
================================================== */

function getFrogCategory(
  weather
) {
  const code =
    Number(
      weather.weather_code
      ?? 0
    );

  const wind =
    Number(
      weather.wind_speed
      ?? 0
    );

  const cloud =
    Number(
      weather.cloud_cover
      ?? 0
    );

  const isDay =
    Boolean(
      weather.is_day
    );

  if (code <= 2) {
    if (wind >= 40) {
      return "25";
    }

    if (code === 0) {
      return cloud <= 20
        ? (
            isDay
              ? "01"
              : "05"
          )
        : (
            isDay
              ? "02"
              : "06"
          );
    }

    if (code === 1) {
      return cloud <= 45
        ? (
            isDay
              ? "02"
              : "06"
          )
        : (
            isDay
              ? "03"
              : "07"
          );
    }

    return cloud <= 70
      ? (
          isDay
            ? "03"
            : "07"
        )
      : (
          isDay
            ? "04"
            : "08"
        );
  }

  if (code === 3) {
    return isDay
      ? "09"
      : "08";
  }

  switch (code) {
    case 45:
    case 48:
      return "26";

    case 51:
    case 53:
    case 55:
      return "10";

    case 56:
    case 57:
      return "19";

    case 61:
    case 63:
    case 80:
    case 81:
      return "11";

    case 65:
    case 82:
      return "12";

    case 66:
    case 67:
      return "20";

    case 71:
    case 77:
      return wind >= 40
        ? "16"
        : "13";

    case 73:
    case 85:
      return wind >= 40
        ? "16"
        : "15";

    case 75:
    case 86:
      return wind >= 40
        ? "16"
        : "17";

    case 95:
      return "22";

    case 96:
    case 99:
      return "24";

    default:
      return isDay
        ? "09"
        : "08";
  }
}

/* ==================================================
   STABLE SCENE PICK
================================================== */

function stablePick(
  items,
  seed
) {
  if (!items?.length) {
    return null;
  }

  let hash = 0;

  for (const char of seed) {
    hash =
      (
        hash * 31
        + char.charCodeAt(0)
      ) >>> 0;
  }

  return items[
    hash
    % items.length
  ];
}

/* ==================================================
   METRICS
================================================== */

function getMetrics(
  weather
) {
  const moonEmoji =
    moonPhaseEmoji(
      weather.moon_phase
    );

  return [
    {
      label:
        "Rain",

      value:
        `${
          Math.round(
            weather.rain_chance
            ?? 0
          )
        }%`,

      meta: [
        `${
          Number(
            weather.precipitation_total
            ?? 0
          ).toFixed(1)
        } mm total`,
      ],
    },

    {
      label:
        "Wind",

      value:
        `${
          Math.round(
            weather.wind_speed
            ?? 0
          )
        } km/h`,

      meta: [
        compass(
          weather.wind_direction
        ),
      ],
    },

    {
      label:
        "Gusts",

      value:
        `${
          Math.round(
            weather.wind_gusts
            ?? 0
          )
        } km/h`,
    },

    {
      label:
        "Pressure",

      value:
        `${
          Math.round(
            weather.pressure
            ?? 0
          )
        } hPa`,
    },

    {
      label:
        "UV",

      value:
        Number(
          weather.uv
          ?? 0
        ).toFixed(1),

      meta: [
        `Max ${
          Number(
            weather.uv_max
            ?? 0
          ).toFixed(1)
        } at ${
          formatTime(
            weather.uv_max_time
          )
        }`,
      ],
    },

    {
      label:
        "Humidity",

      value:
        `${
          Math.round(
            weather.humidity
            ?? 0
          )
        }%`,
    },

    {
      label:
        "Sunrise / Sunset",

      value:
        `↑ ${
          formatTime(
            weather.sunrise
          )
        }`,

      meta: [
        `↓ ${
          formatTime(
            weather.sunset
          )
        }`,
      ],

      special:
        "sun",
    },

    {
      label:
        "Moon phase",

      value:
        moonEmoji,

      meta: [
        `↑ ${
          formatTime(
            weather.moonrise
          )
        }`,

        `↓ ${
          formatTime(
            weather.moonset
          )
        }`,
      ],

      special:
        "moon",
    },
  ];
}

/* ==================================================
   METRIC GRID
================================================== */

function MetricGrid({
  metrics,
  compact = false,
}) {
  return (
    <div
      className={
        compact
          ? "metric-grid compact"
          : "metric-grid"
      }
    >
      {
        metrics.map(
          (metric) => (
            <div
              key={
                metric.label
              }
              className={
                `metric-card ${
                  metric.special
                  ?? ""
                }`
              }
            >
              <div
                className="metric-label"
              >
                {
                  metric.label
                }
              </div>

              <div
                className="metric-main-row"
              >
                <div
                  className="metric-value"
                >
                  {
                    metric.value
                  }
                </div>

                {
                  metric.meta
                    ?.length
                    > 0
                    && (
                      <div
                        className="metric-meta"
                      >
                        {
                          metric.meta.map(
                            (
                              item,
                              index
                            ) => (
                              <span
                                key={
                                  `${metric.label}-${index}`
                                }
                              >
                                {
                                  item
                                }
                              </span>
                            )
                          )
                        }
                      </div>
                    )
                }
              </div>
            </div>
          )
        )
      }
    </div>
  );
}

/* ==================================================
   FROG ART
================================================== */

function FrogArtwork({
  weather,
  wideCatalog,
  format,
}) {
  const category =
    getFrogCategory(
      weather
    );

  const date =
    String(
      weather.updated_at
      ?? ""
    ).slice(
      0,
      10
    );

  if (
    format === "wide"
  ) {
    const options =
      wideCatalog
        ?.categories
        ?.[category]
      ?? [];

    const scene =
      stablePick(
        options,
        `${date}-${category}`
      );

    const src =
      scene
        ?.files
        ?.base
      ?? (
        "/images/frogs/wide/"
        + "09-cloudy-hills-coffee.png"
      );

    return (
      <div
        className="frog-card wide"
      >
        <img
          src={src}
          alt=""
          className="frog-wide-image"
        />
      </div>
    );
  }

  const squareCategory =
    SQUARE_SCENES[
      category
    ]
      ? category
      : (
          SQUARE_FALLBACK[
            category
          ]
          ?? "09"
        );

  const scene =
    stablePick(
      SQUARE_SCENES[
        squareCategory
      ],
      `${date}-${squareCategory}`
    );

  const base =
    `/images/frogs/square/${scene}`;

  return (
    <div
      className="frog-card square"
    >
      {
        [
          `${base}_bg.png`,
          `${base}_mg.png`,
          `${base}_fg.png`,
        ].map(
          (
            src,
            index
          ) => (
            <img
              key={src}
              src={src}
              alt=""
              className={
                `scene-layer layer-${
                  index + 1
                }`
              }
            />
          )
        )
      }
    </div>
  );
}

/* ==================================================
   CURRENT WEATHER
================================================== */

function CurrentSummary({
  weather,
  icon,
}) {
  return (
    <div
      className="current-summary"
    >
      <div
        className="current-reading"
      >
        <div
          className="current-main"
        >
          <div
            className="current-condition-icon"
          >
            {icon}
          </div>

          <div
            className="current-temp"
          >
            {
              Math.round(
                weather.temperature
              )
            }°
          </div>
        </div>

        <div
          className="current-side-meta"
        >
          <div
            className="side-meta-block"
          >
            <span
              className="side-meta-label"
            >
              Feels like
            </span>

            <span
              className="side-meta-value"
            >
              {
                Math.round(
                  weather.feels_like
                  ?? 0
                )
              }°
            </span>
          </div>

          <div
            className="side-meta-block"
          >
            <span
              className="side-meta-label"
            >
              High / Low
            </span>

            <span
              className="side-meta-value"
            >
              {
                Math.round(
                  weather.high
                  ?? 0
                )
              }°
              {" · "}
              {
                Math.round(
                  weather.low
                  ?? 0
                )
              }°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================================================
   PRECIP GRAPH
================================================== */

function PrecipitationGraph({
  points,
}) {
  if (!points?.length) {
    return null;
  }

  const width = 500;
  const height = 76;
  const top = 6;
  const bottom = 58;

  const usableHeight =
    bottom - top;

  const coordinates =
    points.map(
      (
        point,
        index
      ) => {
        const x =
          points.length === 1
            ? width / 2
            : (
                index
                / (
                    points.length
                    - 1
                  )
              )
              * width;

        const probability =
          Math.max(
            0,
            Math.min(
              100,
              Number(
                point.probability
                ?? 0
              )
            )
          );

        const y =
          bottom
          - (
              probability
              / 100
            )
            * usableHeight;

        return {
          x,
          y,
        };
      }
    );

  const linePoints =
    coordinates
      .map(
        ({ x, y }) =>
          `${x},${y}`
      )
      .join(" ");

  const areaPoints = [
    `0,${bottom}`,

    ...coordinates.map(
      ({ x, y }) =>
        `${x},${y}`
    ),

    `${width},${bottom}`,
  ].join(" ");

  return (
    <div
      className="mini-precip-chart"
    >
      <div
        className="mini-precip-percent-row"
      >
        {
          points.map(
            (
              point,
              index
            ) => (
              <span
                key={
                  `${point.time}-percent-${index}`
                }
              >
                {
                  Math.round(
                    point.probability
                    ?? 0
                  )
                }%
              </span>
            )
          )
        }
      </div>

      <svg
        className="mini-precip-svg"
        viewBox={
          `0 0 ${width} ${height}`
        }
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          className="mini-precip-baseline"
          x1="0"
          x2={width}
          y1={bottom}
          y2={bottom}
        />

        <polygon
          className="mini-precip-area"
          points={
            areaPoints
          }
        />

        <polyline
          className="mini-precip-line"
          points={
            linePoints
          }
        />
      </svg>

      <div
        className="mini-precip-time-row"
      >
        {
          points.map(
            (
              point,
              index
            ) => (
              <span
                key={
                  `${point.time}-time-${index}`
                }
              >
                {
                  formatHour(
                    point.time
                  )
                }
              </span>
            )
          )
        }
      </div>
    </div>
  );
}

/* ==================================================
   8 DAY FORECAST
================================================== */

function WeekForecast({
  days,
}) {
  if (
    !Array.isArray(days)
    || days.length === 0
  ) {
    return null;
  }

  const forecastDays =
    days.slice(
      0,
      8
    );

  return (
    <div
      className="mini-week"
    >
      {
        forecastDays.map(
          (
            day,
            index
          ) => {
            const [
              ,
              icon,
            ] =
              weatherInfo(
                day.weather_code
              );

            return (
              <div
                key={
                  day.date
                  ?? index
                }
                className="mini-day"
              >
                <div
                  className="mini-day-name"
                >
                  {
                    formatDay(
                      day.date
                    )
                  }
                </div>

                <div
                  className="mini-day-icon"
                >
                  {icon}
                </div>

                <div
                  className="mini-day-temps"
                >
                  <span
                    className="mini-day-high"
                  >
                    {
                      Math.round(
                        day.high
                      )
                    }°
                  </span>

                  <span
                    className="mini-day-low"
                  >
                    {
                      Math.round(
                        day.low
                      )
                    }°
                  </span>
                </div>

                <div
                  className="mini-day-rain"
                >
                  {
                    Math.round(
                      day.rain_chance
                      ?? 0
                    )
                  }%
                </div>
              </div>
            );
          }
        )
      }
    </div>
  );
}

/* ==================================================
   FORECAST STRIP
================================================== */

function ForecastStrip({
  weather,
}) {
  const precipPoints =
    weather.precip_chart
    ?? [];

  const showPrecip =
    precipPoints.some(
      (point) =>
        Number(
          point.probability
          ?? 0
        )
        >= PRECIP_THRESHOLD
        ||
        Number(
          point.precipitation
          ?? 0
        )
        > 0
    );

  return (
    <div
      className={
        showPrecip
          ? "forecast-strip forecast-strip-split"
          : "forecast-strip forecast-strip-full"
      }
    >
      {
        showPrecip
        && (
          <section
            className="forecast-glass precip-panel"
          >
            <div
              className="forecast-section-header"
            >
              <span>
                Precipitation
              </span>

              <span
                className="forecast-section-note"
              >
                Next 24h
              </span>
            </div>

            <PrecipitationGraph
              points={
                precipPoints
              }
            />
          </section>
        )
      }

      <section
        className="forecast-glass week-panel"
      >
        <WeekForecast
          days={
            weather.weekly
          }
        />
      </section>
    </div>
  );
}

/* ==================================================
   HERO
================================================== */

function WideHero({
  weather,
  wideCatalog,
}) {
  const [
    ,
    icon,
  ] =
    weatherInfo(
      weather.weather_code
    );

  return (
    <section
      className="hero-card"
    >
      <div
        className="hero-copy"
      >
        <div
          className="hero-main"
        >
          <CurrentSummary
            weather={
              weather
            }
            icon={
              icon
            }
          />

          <MetricGrid
            metrics={
              getMetrics(
                weather
              )
            }
          />
        </div>
      </div>

      <FrogArtwork
        format="wide"
        weather={
          weather
        }
        wideCatalog={
          wideCatalog
        }
      />
    </section>
  );
}

/* ==================================================
   SQUARE BACKUP
================================================== */

function SquareHero({
  weather,
  wideCatalog,
}) {
  const [
    condition,
    icon,
  ] =
    weatherInfo(
      weather.weather_code
    );

  return (
    <section
      className="square-dashboard-card"
    >
      <div
        className="square-frame"
      >
        <FrogArtwork
          format="square"
          weather={
            weather
          }
          wideCatalog={
            wideCatalog
          }
        />

        <div
          className="square-overlay"
        >
          <div
            className="square-summary"
          >
            <div
              className="square-condition"
            >
              {icon} {condition}
            </div>

            <div
              className="square-temp"
            >
              {
                Math.round(
                  weather.temperature
                )
              }°
            </div>

            <div>
              Feels{" "}
              {
                Math.round(
                  weather.feels_like
                  ?? 0
                )
              }°
              {" · "}
              H{" "}
              {
                Math.round(
                  weather.high
                  ?? 0
                )
              }°
              {" · "}
              L{" "}
              {
                Math.round(
                  weather.low
                  ?? 0
                )
              }°
            </div>
          </div>

          <MetricGrid
            metrics={
              getMetrics(
                weather
              )
            }
            compact
          />
        </div>
      </div>
    </section>
  );
}

/* ==================================================
   APP
================================================== */

function App() {
  const [
    weather,
    setWeather,
  ] =
    useState(null);

  const [
    wideCatalog,
    setWideCatalog,
  ] =
    useState(null);

  const [
    error,
    setError,
  ] =
    useState(null);

  useEffect(
    () => {
      let active = true;

      async function loadWeather() {
        try {
          const response =
            await fetch(
              "/api/weather"
            );

          if (
            !response.ok
          ) {
            throw new Error(
              `Weather request failed: ${
                response.status
              }`
            );
          }

          const data =
            await response.json();

          if (active) {
            setWeather(
              data
            );

            setError(
              null
            );
          }

        } catch (err) {
          if (active) {
            setError(
              err.message
            );
          }
        }
      }

      loadWeather();

      const interval =
        setInterval(
          loadWeather,
          10
          * 60
          * 1000
        );

      return () => {
        active = false;

        clearInterval(
          interval
        );
      };
    },
    []
  );

  useEffect(
    () => {
      let active = true;

      fetch(
        "/frog-scenes-wide.json"
      )
        .then(
          (
            response
          ) => {
            if (
              !response.ok
            ) {
              throw new Error(
                "Could not load Frog scene catalogue"
              );
            }

            return response.json();
          }
        )
        .then(
          (data) => {
            if (active) {
              setWideCatalog(
                data
              );
            }
          }
        )
        .catch(
          console.error
        );

      return () => {
        active = false;
      };
    },
    []
  );

  if (error) {
    return (
      <main
        className="shell center"
      >
        <div
          className="error-card"
        >
          <div
            className="frog"
          >
            🐸
          </div>

          <h2>
            Weather unavailable
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={
              () =>
                window
                  .location
                  .reload()
            }
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!weather) {
    return (
      <main
        className="shell center"
      >
        <div
          className="loading"
        >
          Loading weather…
        </div>
      </main>
    );
  }

  return (
    <main
      className={
        `shell ${
          weather.is_day
            ? "day"
            : "night"
        }`
      }
    >
      <div
        className="glow glow-one"
      />

      <div
        className="glow glow-two"
      />

      <div
        className="dashboard"
      >
        <header>
          <div>
            <div
              className="kicker"
            >
              TODAY · {
                weather.location
              }
            </div>

            <h1>
              Weather, with frog.
            </h1>
          </div>

          <div
            className="updated"
          >
            Updated{" "}
            {
              formatTime(
                weather.updated_at
              )
            }
          </div>
        </header>

        {
          FROG_FORMAT
          === "square"
            ? (
                <SquareHero
                  weather={
                    weather
                  }
                  wideCatalog={
                    wideCatalog
                  }
                />
              )
            : (
                <>
                  <WideHero
                    weather={
                      weather
                    }
                    wideCatalog={
                      wideCatalog
                    }
                  />

                  <ForecastStrip
                    weather={
                      weather
                    }
                  />
                </>
              )
        }
      </div>
    </main>
  );
}

export default App;