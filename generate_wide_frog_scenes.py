from pathlib import Path
import json
import re


FROG_DIR = Path("frontend/public/images/frogs/wide")
OUTPUT_FILE = Path("frontend/public/frog-scenes-wide.json")


CATEGORY_NAMES = {
    "01": "sunny",
    "02": "mostly-sunny",
    "03": "partly-cloudy-day",
    "04": "mostly-cloudy-day",
    "05": "clear",
    "06": "mostly-clear",
    "07": "partly-cloudy-night",
    "08": "mostly-cloudy-night",
    "09": "cloudy",
    "10": "drizzle",
    "11": "rain",
    "12": "heavy-rain",
    "13": "flurries",
    "15": "snow-showers-snow",
    "16": "blowing-snow",
    "17": "heavy-snow-blizzard",
    "19": "mixed-rain-hail-rain-sleet",
    "20": "rain-snow-wintry-mix",
    "22": "iso-thunderstorms",
    "24": "strong-thunderstorms",
    "25": "breezy-windy",
    "26": "haze-fog-dust-smoke",
}


def split_variant(filename: str):
    """
    Examples:

    03-partly-cloudy-day-field-biking.png
        -> base scene, variant 'base'

    03-partly-cloudy-day-field-biking_c.png
        -> same scene, variant 'c'

    03-partly-cloudy-day-field-biking_f.png
        -> same scene, variant 'f'
    """

    stem = Path(filename).stem

    if stem.endswith("_c"):
        return stem[:-2], "c"

    if stem.endswith("_f"):
        return stem[:-2], "f"

    return stem, "base"


def get_category(scene_name: str):
    """
    Pull the leading Google category number.

    03-partly-cloudy-day-field-biking
    -> 03
    """

    match = re.match(r"^(\d{2})-", scene_name)

    if not match:
        return None

    return match.group(1)


def get_scene_description(scene_name: str, category: str):
    """
    Removes the leading number and category name,
    leaving the location/activity portion.

    Example:

    03-partly-cloudy-day-field-biking
    -> field-biking
    """

    condition = CATEGORY_NAMES.get(category)

    if not condition:
        return None

    prefix = f"{category}-{condition}-"

    if scene_name.startswith(prefix):
        return scene_name[len(prefix):]

    return None


def main():
    if not FROG_DIR.exists():
        print(f"Folder not found: {FROG_DIR}")
        return

    scenes = {}

    for file in sorted(FROG_DIR.iterdir()):

        if not file.is_file():
            continue

        if file.suffix.lower() != ".png":
            continue

        scene_name, variant = split_variant(file.name)

        category = get_category(scene_name)

        if category is None:
            print(f"Skipping unknown filename: {file.name}")
            continue

        if scene_name not in scenes:
            scenes[scene_name] = {
                "name": scene_name,
                "category": category,
                "condition": CATEGORY_NAMES.get(
                    category,
                    "unknown",
                ),
                "scene": get_scene_description(
                    scene_name,
                    category,
                ),
                "files": {},
            }

        scenes[scene_name]["files"][variant] = (
            f"/images/frogs/wide/{file.name}"
        )

    categories = {}

    for scene_name in sorted(scenes):
        scene = scenes[scene_name]

        category = scene["category"]

        if category not in categories:
            categories[category] = {
                "condition": scene["condition"],
                "scenes": [],
            }

        categories[category]["scenes"].append(scene)

    output = {
        "source_directory": str(FROG_DIR),
        "scene_count": len(scenes),
        "category_count": len(categories),
        "categories": categories,
    }

    OUTPUT_FILE.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with OUTPUT_FILE.open(
        "w",
        encoding="utf-8",
    ) as f:
        json.dump(
            output,
            f,
            indent=2,
            ensure_ascii=False,
        )

    print()
    print(f"Found {len(scenes)} frog scenes.")
    print(f"Found {len(categories)} weather categories.")
    print(f"Saved JSON to:")
    print(OUTPUT_FILE)
    print()

    for number, category in categories.items():
        print(
            f"{number} "
            f"{category['condition']}: "
            f"{len(category['scenes'])} scenes"
        )


if __name__ == "__main__":
    main()