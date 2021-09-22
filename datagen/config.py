from datetime import date
from os import path
from pytz import timezone
import re

# Lower bound for time series and GTFS feeds
START_DATE = date(2020, 2, 6)

# Date to use as a baseline
PRE_COVID_DATE = date(2020, 2, 24)

TIME_ZONE = timezone("US/Eastern")

# Should point to data.json in the root of the repo
OUTPUT_FILE = path.normpath(path.join(path.dirname(__file__), "..", "data.json"))

IGNORE_LINE_IDS = ["line-CapeFlyer"]

GTFS_ARCHIVE_URL = "https://cdn.mbta.com/archive/archived_feeds.txt"
GTFS_DATA_PATH = path.join(path.dirname(__file__), "gtfs", ".data")

RIDERSHIP_BOX_URL = "https://massdot.app.box.com/s/21j0q5di9ewzl0abt6kdh5x8j8ok9964"
RIDERSHIP_DATA_PATH = path.join(path.dirname(__file__), "ridership", ".data")

# Change to e.g. date(2021, 8, 8) to load ridership data already in datagen/ridership/.data
# rather than attempting to fetch later data from the MassDOT Box endpoint.
RIDERSHIP_TARGET_DATE = date(2021, 9, 14)

# Patterns to find several files in the MassDOT Box endpoint.
RIDERSHIP_BUS_XLSX_REGEX = re.compile(
    r"Weekly_Bus_Ridership_by_Route_(\d{4})\.(\d{1,2})\.(\d{1,2})", re.I
)
RIDERSHIP_SUBWAY_CSV_REGEX = re.compile(
    r"(\d{4})\.(\d{1,2})\.(\d{1,2}) MBTA Gated Station Validations by line", re.I
)
