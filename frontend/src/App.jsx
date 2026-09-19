import { useEffect, useState } from "react";


/* ==================================================
   FROG FORMAT

   Default = WIDE at every screen size.

   The browser width does NOT switch the artwork
   to square anymore. Responsive cropping is handled
   entirely by CSS.

   Optional frontend/.env:

     VITE_FROG_FORMAT=wide
     VITE_FROG_FORMAT=square

   Missing / "auto" / anything else = wide.
================================================== */

function useFrogFormat() {
  const configured =
    (
      import.meta.env.VITE_FROG_FORMAT ??
      "wide"
    ).toLowerCase();

  return configured === "square"
    ? "square"
    : "wide";
}


/* ==================================================
   WEATHER LABELS
================================================== */

const WEATHER = {
  0: ["Clear sky", "☀️"],
  1: ["Mainly clear", "🌤️"],
  2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"],

  45: ["Fog", "🌫️"],
  48: ["Rime fog", "🌫️"],

  51: ["Light drizzle", "🌦️"],
  53: ["Drizzle", "🌦️"],
  55: ["Heavy drizzle", "🌧️"],

  56: ["Light freezing drizzle", "🌧️"],
  57: ["Freezing drizzle", "🌧️"],

  61: ["Light rain", "🌦️"],
  63: ["Rain", "🌧️"],
  65: ["Heavy rain", "🌧️"],

  66: ["Light freezing rain", "🌧️"],
  67: ["Freezing rain", "🌧️"],

  71: ["Light snow", "🌨️"],
  73: ["Snow", "❄️"],
  75: ["Heavy snow", "❄️"],
  77: ["Snow grains", "🌨️"],

  80: ["Light rain showers", "🌦️"],
  81: ["Rain showers", "🌧️"],
  82: ["Heavy rain showers", "🌧️"],

  85: ["Snow showers", "🌨️"],
  86: ["Heavy snow showers", "❄️"],

  95: ["Thunderstorm", "⛈️"],
  96: ["Thunderstorm with hail", "⛈️"],
  99: ["Strong thunderstorm with hail", "⛈️"],
};


/* ==================================================
   SQUARE FROG SCENES

   Kept as a manual fallback.
================================================== */

const SQUARE_SCENES = {
  "01": [
    "01-sunny-beach-reading",
    "01-sunny-beach-sandcastle",
    "01-sunny-beach-sunscreen",
    "01-sunny-citypark-picnic",
    "01-sunny-creek-swimming",
    "01-sunny-field-biking",
    "01-sunny-field-hiking",
    "01-sunny-field-kite",
    "01-sunny-hills-painting",
    "01-sunny-hills-reading",
    "01-sunny-hills-sunbathing",
    "01-sunny-orchard-pickingfruit",
    "01-sunny-rooftop-pinacolada",
  ],

  "02": [
    "02-mostly-sunny-beach-reading",
    "02-mostly-sunny-beach-sandcastle",
    "02-mostly-sunny-beach-sunscreen",
    "02-mostly-sunny-citypark-picnic",
    "02-mostly-sunny-creek-swimming",
    "02-mostly-sunny-field-biking",
    "02-mostly-sunny-field-hiking",
    "02-mostly-sunny-field-kite",
    "02-mostly-sunny-hills-painting",
    "02-mostly-sunny-hills-reading",
    "02-mostly-sunny-hills-sunbathing",
    "02-mostly-sunny-orchard-pickingfruit",
    "02-mostly-sunny-rooftop-pinacolada",
  ],

  "03": [
    "03-partly-cloudy-day-beach-shells",
    "03-partly-cloudy-day-citypark-ukelele",
    "03-partly-cloudy-day-creek-feet",
    "03-partly-cloudy-day-field-biking",
    "03-partly-cloudy-day-field-hiking",
    "03-partly-cloudy-day-hills-painting",
    "03-partly-cloudy-day-hills-reading",
    "03-partly-cloudy-day-orchard-butterflies",
    "03-partly-cloudy-day-orchard-treeswing",
  ],

  "04": [
    "04-mostly-cloudy-day-beach-shells",
    "04-mostly-cloudy-day-citypark-ukelele",
    "04-mostly-cloudy-day-creek-feet",
    "04-mostly-cloudy-day-field-biking",
    "04-mostly-cloudy-day-field-hiking",
    "04-mostly-cloudy-day-hills-painting",
    "04-mostly-cloudy-day-hills-reading",
    "04-mostly-cloudy-day-orchard-butterflies",
    "04-mostly-cloudy-day-orchard-treeswing",
  ],

  "05": [
    "05-clear-creek-stars",
    "05-clear-field-lanterns",
    "05-clear-hills-camping",
    "05-clear-hills-telescope",
    "05-clear-orchard-fireflies",
  ],

  "06": [
    "06-mostly-clear-creek-stars",
    "06-mostly-clear-field-lanterns",
    "06-mostly-clear-hills-camping",
    "06-mostly-clear-hills-telescope",
    "06-mostly-clear-orchard-fireflies",
  ],

  "07": [
    "07-partly-cloudy-night-creek-fireflies",
    "07-partly-cloudy-night-field-fireflies",
    "07-partly-cloudy-night-hills-smores",
    "07-partly-cloudy-night-orchard-eating",
    "07-partly-cloudy-night-rooftop-dinner",
  ],

  "08": [
    "08-mostly-cloudy-night-creek-fireflies",
    "08-mostly-cloudy-night-field-fireflies",
    "08-mostly-cloudy-night-hills-smores",
    "08-mostly-cloudy-night-orchard-eating",
    "08-mostly-cloudy-night-rooftop-dinner",
  ],

  "09": [
    "09-cloudy-hills-coffee",
    "09-cloudy-orchard-watching",
  ],

  "10": [
    "10-drizzle-creek-leaf",
    "10-drizzle-field-leaf",
    "10-drizzle-hills-umbrella",
    "10-drizzle-orchard-reading",
  ],

  "11": [
    "11-rain-creek-leaf",
    "11-rain-field-leaf",
    "11-rain-hills-umbrella",
    "11-rain-orchard-reading",
  ],

  "12": [
    "12-heavy-rain-busstop-umbrella",
    "12-heavy-rain-creek-leaf",
  ],

  "13": [
    "13-flurries-citypark-snowman",
    "13-flurries-creek-iceskating",
  ],

  "15": [
    "15-snow-showers-snow-citypark-snowman",
    "15-snow-showers-snow-creek-skating",
  ],

  "16": [
    "16-blowing-snow-field-snowman",
  ],

  "17": [
    "17-heavy-snow-blizzard-creek-cocoa",
  ],

  "19": [
    "19-mixed-rain-hail-rain-sleet-busstop-waiting",
    "19-mixed-rain-hail-rain-sleet-cafe-entering",
  ],

  "20": [
    "20-rain-snow-wintry-mix-citypark-snowman",
  ],

  "25": [
    "25-breezy-windy-creek-pinwheel",
  ],

  "26": [
    "26-haze-fog-dust-smoke-field-lantern",
  ],
};


const SQUARE_CATEGORY_FALLBACK = {
  "22": "12",
  "24": "19",
};


/* ==================================================
   WEATHER -> FROG CATEGORY
================================================== */

function getSkyCategory(weather) {
  const code =
    weather.weather_code;

  const cloudCover =
    weather.cloud_cover;

  const isDay =
    weather.is_day;


  if (cloudCover == null) {
    if (code === 0) {
      return isDay ? "01" : "05";
    }

    if (code === 1) {
      return isDay ? "02" : "06";
    }

    return isDay ? "03" : "07";
  }


  if (code === 0) {
    return cloudCover <= 20
      ? isDay
        ? "01"
        : "05"
      : isDay
        ? "02"
        : "06";
  }


  if (code === 1) {
    return cloudCover <= 45
      ? isDay
        ? "02"
        : "06"
      : isDay
        ? "03"
        : "07";
  }


  if (code === 2) {
    return cloudCover <= 70
      ? isDay
        ? "03"
        : "07"
      : isDay
        ? "04"
        : "08";
  }


  return isDay
    ? "09"
    : "08";
}


function getFrogCategory(weather) {
  const code =
    weather.weather_code;

  const windSpeed =
    weather.wind_speed ?? 0;


  if ([45, 48].includes(code)) {
    return "26";
  }


  if ([51, 53, 55].includes(code)) {
    return "10";
  }


  if ([56, 57].includes(code)) {
    return "19";
  }


  if ([61, 63].includes(code)) {
    return "11";
  }


  if (code === 65) {
    return "12";
  }


  if ([66, 67].includes(code)) {
    return "20";
  }


  if ([71, 77].includes(code)) {
    return windSpeed >= 40
      ? "16"
      : "13";
  }


  if (code === 73) {
    return windSpeed >= 40
      ? "16"
      : "15";
  }


  if (code === 75) {
    return windSpeed >= 40
      ? "16"
      : "17";
  }


  if ([80, 81].includes(code)) {
    return "11";
  }


  if (code === 82) {
    return "12";
  }


  if (code === 85) {
    return "15";
  }


  if (code === 86) {
    return "17";
  }


  if (code === 95) {
    return "22";
  }


  if ([96, 99].includes(code)) {
    return "24";
  }


  /*
    Overcast at night uses the darker
    mostly-cloudy-night category.
  */

  if (code === 3) {
    return weather.is_day
      ? "09"
      : "08";
  }


  /*
    Strong wind overrides otherwise ordinary
    clear/cloudy weather.
  */

  if (
    [0, 1, 2].includes(code) &&
    windSpeed >= 40
  ) {
    return "25";
  }


  if ([0, 1, 2].includes(code)) {
    return getSkyCategory(weather);
  }


  return weather.is_day
    ? "09"
    : "08";
}


/* ==================================================
   STABLE DAILY SCENE
================================================== */

function hashString(value) {
  let hash = 0;

  for (
    let i = 0;
    i < value.length;
    i++
  ) {
    hash =
      (
        hash * 31 +
        value.charCodeAt(i)
      ) >>> 0;
  }

  return hash;
}


function chooseStableItem(
  items,
  weather,
  category,
) {
  if (!items?.length) {
    return null;
  }


  const date =
    weather.updated_at
      ?.split("T")[0] ??
    new Date()
      .toISOString()
      .slice(0, 10);


  const seed =
    `${date}-${category}`;


  return items[
    hashString(seed) %
      items.length
  ];
}


/* ==================================================
   WIDE SCENE
================================================== */

function chooseWideScene(
  catalog,
  category,
  weather,
) {
  const scenes =
    catalog
      ?.categories
      ?.[category]
      ?.scenes;


  if (!scenes?.length) {
    return null;
  }


  const usable =
    scenes.filter(
      (scene) =>
        scene.files?.base,
    );


  return chooseStableItem(
    usable,
    weather,
    category,
  );
}


/* ==================================================
   SQUARE SCENE
================================================== */

function chooseSquareScene(
  category,
  weather,
) {
  const actualCategory =
    SQUARE_SCENES[category]
      ? category
      : SQUARE_CATEGORY_FALLBACK[
          category
        ] ?? "09";


  return chooseStableItem(
    SQUARE_SCENES[
      actualCategory
    ],
    weather,
    actualCategory,
  );
}


function getSquareFiles(
  baseName,
) {
  const base =
    `/images/frogs/square/${baseName}`;


  return {
    background:
      `${base}_bg.png`,

    midground:
      `${base}_mg.png`,

    foreground:
      `${base}_fg.png`,
  };
}


/* ==================================================
   DISPLAY HELPERS
================================================== */

function weatherInfo(
  code,
  isDay,
) {
  if (!isDay) {
    if (code === 0) {
      return [
        "Clear night",
        "🌙",
      ];
    }

    if (code === 1) {
      return [
        "Mostly clear",
        "🌙",
      ];
    }

    if (code === 2) {
      return [
        "Partly cloudy",
        "☁️",
      ];
    }

    if (code === 3) {
      return [
        "Overcast",
        "☁️",
      ];
    }
  }


  return (
    WEATHER[code] ??
    ["Weather", "🌤️"]
  );
}


function compass(degrees) {
  if (
    degrees == null ||
    Number.isNaN(
      Number(degrees),
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
      Number(degrees) / 45,
    ) % 8
  ];
}


function formatTime(iso) {
  if (!iso) {
    return "—";
  }


  return new Date(
    iso,
  ).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}


function uvLabel(uv) {
  if (uv < 3) {
    return "Low";
  }

  if (uv < 6) {
    return "Moderate";
  }

  if (uv < 8) {
    return "High";
  }

  if (uv < 11) {
    return "Very high";
  }

  return "Extreme";
}


/* ==================================================
   METRICS

   Shared by wide and square modes.
================================================== */

function getMetrics(weather) {
  const precipitationNow =
    Number(
      weather.precipitation_now ?? 0,
    );


  return [
    {
      label: "Feels like",

      value:
        `${Math.round(
          weather.feels_like,
        )}°`,
    },


    {
      label: "High / Low",

      value:
        `${Math.round(
          weather.high,
        )}° · ${Math.round(
          weather.low,
        )}°`,
    },


    {
      label: "Rain",

      value:
        `${Math.round(
          weather.rain_chance,
        )}%`,

      sub:
        `${precipitationNow.toFixed(1)} mm now`,
    },


    {
      label: "Wind",

      value:
        `${Math.round(
          weather.wind_speed,
        )} km/h`,

      sub:
        compass(
          weather.wind_direction,
        ),
    },


    {
      label: "Gusts",

      value:
        `${Math.round(
          weather.wind_gusts,
        )} km/h`,
    },


    {
      label: "Pressure",

      value:
        `${Math.round(
          weather.pressure,
        )}`,

      sub:
        "hPa",
    },


    {
      label: "UV",

      value:
        Number(
          weather.uv_max ?? 0,
        ).toFixed(1),

      sub:
        uvLabel(
          weather.uv_max ?? 0,
        ),
    },


    {
      label: "Cloud",

      value:
        weather.cloud_cover == null
          ? "—"
          : `${Math.round(
              weather.cloud_cover,
            )}%`,
    },
  ];
}


/* ==================================================
   FROG ARTWORK
================================================== */

function FrogArtwork({
  format,
  wideScene,
  squareScene,
}) {

  if (format === "wide") {
    const image =
      wideScene?.files?.base ??
      "/images/frogs/wide/09-cloudy-hills-coffee.png";


    return (
      <div className="frog-card wide">

        <img
          src={image}
          className="frog-wide-image"
          alt=""
        />

      </div>
    );
  }


  const files =
    getSquareFiles(
      squareScene ??
        "09-cloudy-hills-coffee",
    );


  return (
    <div className="frog-card square">

      <div className="frog-scene">

        <img
          src={files.background}
          className="scene-layer layer-1"
          alt=""
        />


        <img
          src={files.midground}
          className="scene-layer layer-2"
          alt=""
        />


        <img
          src={files.foreground}
          className="scene-layer layer-3"
          alt=""
        />

      </div>

    </div>
  );
}


/* ==================================================
   WIDE HERO
================================================== */

function WideHero({
  weather,
  info,
  wideScene,
  squareScene,
}) {

  const metrics =
    getMetrics(weather);


  return (
    <section className="hero-card wide-hero">

      <div className="hero-copy">

        <div className="hero-main">


          {/* TEMPERATURE */}

          <div className="hero-temp-block">

            <div className="temperature">

              {Math.round(
                weather.temperature,
              )}
              °

            </div>


            <div className="hero-temp-caption">
              Current temperature
            </div>

          </div>


          {/* CONDITION */}

          <div className="hero-condition">

            <div className="hero-badge">

              <span className="weather-icon">
                {info[1]}
              </span>


              <span>
                {info[0]}
              </span>

            </div>

          </div>


          {/* METRICS */}

          <div className="hero-meta">

            {metrics.map(
              (
                metric,
                index,
              ) => (

                <div
                  className="hero-meta-card"
                  key={
                    `${metric.label}-${index}`
                  }
                >

                  <span className="hero-meta-label">
                    {metric.label}
                  </span>


                  <span className="hero-meta-value">
                    {metric.value}
                  </span>


                  {metric.sub && (

                    <span className="hero-meta-sub">
                      {metric.sub}
                    </span>

                  )}

                </div>

              ),
            )}

          </div>

        </div>

      </div>


      <FrogArtwork
        format="wide"
        wideScene={wideScene}
        squareScene={squareScene}
      />

    </section>
  );
}


/* ==================================================
   SQUARE HERO

   Still retained as a manual backup.

   It will ONLY appear when:

     VITE_FROG_FORMAT=square
================================================== */

function SquareHero({
  weather,
  info,
  wideScene,
  squareScene,
}) {

  const metrics =
    getMetrics(weather);


  return (
    <section className="square-dashboard-card">

      <div className="square-hero-frame">


        <FrogArtwork
          format="square"
          wideScene={wideScene}
          squareScene={squareScene}
        />


        <div className="square-weather-overlay">

          <div className="square-top-panel">


            {/* TEMP */}

            <div className="square-temp-column">

              <div className="square-temperature">

                {Math.round(
                  weather.temperature,
                )}
                °

              </div>


              <div className="square-temp-caption">
                Current temperature
              </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="square-info-column">


              <div className="square-condition-line">

                <div className="square-condition-pill">

                  <span className="weather-icon">
                    {info[1]}
                  </span>


                  <span>
                    {info[0]}
                  </span>

                </div>


                <div className="square-overlay-time">

                  {formatTime(
                    weather.updated_at,
                  )}

                </div>

              </div>


              <div className="square-mini-grid">

                {metrics.map(
                  (
                    metric,
                    index,
                  ) => (

                    <div
                      className="square-mini-card"
                      key={
                        `${metric.label}-${index}`
                      }
                    >

                      <span className="square-mini-label">
                        {metric.label}
                      </span>


                      <strong className="square-mini-value">
                        {metric.value}
                      </strong>


                      {metric.sub && (

                        <span className="square-mini-sub">
                          {metric.sub}
                        </span>

                      )}

                    </div>

                  ),
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}


/* ==================================================
   APP
================================================== */

export default function App() {

  /*
    This no longer changes when the browser
    is resized.

    Default is always "wide".
  */

  const frogFormat =
    useFrogFormat();


  const [
    weather,
    setWeather,
  ] = useState(null);


  const [
    frogCatalog,
    setFrogCatalog,
  ] = useState(null);


  const [
    error,
    setError,
  ] = useState("");


  /* ==================================================
     LOAD WEATHER
  ================================================== */

  async function loadWeather() {
    try {

      setError("");


      const response =
        await fetch(
          "/api/weather",
        );


      if (!response.ok) {
        throw new Error(
          "Weather request failed",
        );
      }


      const data =
        await response.json();


      setWeather(data);

    } catch (err) {

      setError(
        err.message,
      );

    }
  }


  /* ==================================================
     LOAD WIDE FROG CATALOG
  ================================================== */

  async function loadFrogCatalog() {
    try {

      const response =
        await fetch(
          "/frog-scenes-wide.json",
        );


      if (!response.ok) {
        throw new Error(
          "Could not load frog catalog",
        );
      }


      const data =
        await response.json();


      setFrogCatalog(data);

    } catch (err) {

      console.error(err);

    }
  }


  /* ==================================================
     INITIAL LOAD + WEATHER REFRESH
  ================================================== */

  useEffect(() => {

    loadWeather();

    loadFrogCatalog();


    const timer =
      setInterval(
        loadWeather,
        10 * 60 * 1000,
      );


    return () => {
      clearInterval(timer);
    };

  }, []);


  /* ==================================================
     ERROR
  ================================================== */

  if (error) {
    return (
      <main className="shell center">

        <div className="error-card">

          <div className="frog">
            🐸
          </div>


          <h1>
            Weather went for a swim.
          </h1>


          <p>
            {error}
          </p>


          <button
            onClick={
              loadWeather
            }
          >
            Try again
          </button>

        </div>

      </main>
    );
  }


  /* ==================================================
     LOADING
  ================================================== */

  if (!weather) {
    return (
      <main className="shell center">

        <div className="loading">
          Finding today’s weather…
        </div>

      </main>
    );
  }


  /* ==================================================
     SCENE SELECTION
  ================================================== */

  const category =
    getFrogCategory(
      weather,
    );


  const wideScene =
    chooseWideScene(
      frogCatalog,
      category,
      weather,
    );


  const squareScene =
    chooseSquareScene(
      category,
      weather,
    );


  const info =
    weatherInfo(
      weather.weather_code,
      weather.is_day,
    );


  /* ==================================================
     PAGE
  ================================================== */

  return (
    <main
      className={`shell ${
        weather.is_day
          ? "day"
          : "night"
      }`}
    >

      <div className="glow glow-one" />

      <div className="glow glow-two" />


      <section className="dashboard">


        {/* HEADER */}

        <header>

          <div>

            <div className="kicker">

              TODAY ·{" "}

              {weather.location.toUpperCase()}

            </div>


            <h1>
              Weather, with frog.
            </h1>

          </div>


          <div className="updated">

            Updated{" "}

            {formatTime(
              weather.updated_at,
            )}

          </div>

        </header>


        {/* HERO

            Normal/default behaviour:
              ALWAYS WIDE

            Square only happens if manually forced
            with VITE_FROG_FORMAT=square.
        */}

        {frogFormat === "square" ? (

          <SquareHero
            weather={weather}
            info={info}
            wideScene={wideScene}
            squareScene={squareScene}
          />

        ) : (

          <WideHero
            weather={weather}
            info={info}
            wideScene={wideScene}
            squareScene={squareScene}
          />

        )}


        {/* SUNRISE / SUNSET */}

        <footer>

          <span>

            Sunrise{" "}

            {formatTime(
              weather.sunrise,
            )}

          </span>


          <span className="dot">
            •
          </span>


          <span>

            Sunset{" "}

            {formatTime(
              weather.sunset,
            )}

          </span>

        </footer>


      </section>

    </main>
  );
}