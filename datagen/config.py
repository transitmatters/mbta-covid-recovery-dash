from datetime import date
from os import path
from pytz import timezone
import re

# Lower bound for time series and GTFS feeds
EARLIEST_DATE = date(2020, 2, 6)

# Date to use as a baseline
PRE_COVID_DATE = date(2020, 2, 24)

TIME_ZONE = timezone("US/Eastern")

# Should point to data.json in the root of the repo
OUTPUT_FILE = path.normpath(path.join(path.dirname(__file__), "..", "data.json"))

IGNORE_LINE_IDS = ["line-CapeFlyer", "line-Foxboro"]

GTFS_ARCHIVE_URL = "https://cdn.mbta.com/archive/archived_feeds.txt"
GTFS_DATA_PATH = path.join(path.dirname(__file__), "gtfs", ".data")

RIDERSHIP_BOX_URL = "https://massdot.app.box.com/s/21j0q5di9ewzl0abt6kdh5x8j8ok9964"
RIDERSHIP_DATA_PATH = path.join(path.dirname(__file__), "ridership", ".data")

CR_RIDERSHIP_ARCGIS_URL = "https://opendata.arcgis.com/api/v3/datasets/e2635c945f5b47a7923e0ee441b040c8_0/downloads/data?format=csv&spatialRefId=4326&where=1=1"
CR_SEASONAL_RIDERSHIP_ARCGIS_URL = "https://opendata.arcgis.com/api/v3/datasets/3b93de20570f462ea27219dfb7e75347_0/downloads/data?format=csv&spatialRefId=4326&where=1=1"

# Change to e.g. date(2021, 8, 8) to load ridership data already in datagen/ridership/.data
# rather than attempting to fetch later data from the MassDOT Box endpoint.
RIDERSHIP_TARGET_DATE = None

CUTOFF_DATE = date(2024, 1, 5)

# Patterns to find several files in the MassDOT Box endpoint.
RIDERSHIP_BUS_XLSX_REGEX = re.compile(r"Weekly_Bus_Ridership_by_Route_(\d{4})\.(\d{1,2})\.(\d{1,2})", re.I)
RIDERSHIP_SUBWAY_CSV_REGEX = re.compile(r"(\d{4})\.(\d{1,2})\.(\d{1,2}) MBTA Gated Station Validations by line", re.I)

# Date ranges with service gaps that we paper over because of major holidays rather than doing
# more complicated special-casing with GTFS services
FILL_DATE_RANGES = [
    (date(2021, 11, 19), date(2021, 11, 26)),  # Thanksgiving 2021
    (date(2021, 12, 18), date(2021, 12, 26)),  # Christmas 2021
    (date(2022, 12, 18), date(2023, 1, 3)),  # Christmas 2022
]

# Date ranges with service anomalies that we'll smooth over with the previous date's values
IGNORE_DATE_RANGES = [
    (date(2022, 3, 28), date(2022, 3, 29)),  # Haymarket garage collapse
]
