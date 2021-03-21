from datetime import date
from os import path
from pytz import timezone

ARCHIVE_URL = "https://cdn.mbta.com/archive/archived_feeds.txt"
START_DATE = date(year=2020, month=2, day=1)
GTFS_DATA_PATH = path.join(path.dirname(__file__), "gtfs", ".data")
OUTPUT_FILE = path.normpath(path.join(path.dirname(__file__), "..", "data.json"))
TIME_ZONE = timezone("US/Eastern")