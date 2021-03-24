from datetime import date
from os import path
from pytz import timezone

ARCHIVE_URL = "https://cdn.mbta.com/archive/archived_feeds.txt"
START_DATE = date(2020, 2, 6)
PRE_COVID_DATE = date(2020, 3, 1)
RECENT_SERVICE_CUTS_DATE = date(2021, 3, 13)
GTFS_DATA_PATH = path.join(path.dirname(__file__), "gtfs", ".data")
RIDERSHIP_DATA_PATH = path.join(path.dirname(__file__), "ridership", ".data")
OUTPUT_FILE = path.normpath(path.join(path.dirname(__file__), "..", "data.json"))
TIME_ZONE = timezone("US/Eastern")