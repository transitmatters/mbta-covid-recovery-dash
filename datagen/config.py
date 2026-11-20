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

RIDERSHIP_DATA_PATH = path.join(path.dirname(__file__), "ridership", ".data")

CR_RIDERSHIP_ARCGIS_URL = "https://www.arcgis.com/sharing/rest/content/items/59b5c61e8e9f42f9a3745f7ad63d07d6/data?format=csv&spatialRefId=4326&where=1=1"
CR_SEASONAL_RIDERSHIP_ARCGIS_URL = "https://opendata.arcgis.com/api/v3/datasets/9e8089a985f24bc6a1dbae1e69703808_0/downloads/data?format=csv&spatialRefId=4326&where=1=1"
# These datasets are large enough that ArcGIS Hub doesn't refresh its cached CSVs on its own.
ARCGIS_UPDATE_CACHE_URLS = [
    "https://hub.arcgis.com/api/download/v1/items/59b5c61e8e9f42f9a3745f7ad63d07d6/csv?redirect=false&layers=0&updateCache=true",
    "https://hub.arcgis.com/api/download/v1/items/9e8089a985f24bc6a1dbae1e69703808/csv?redirect=false&layers=0&updateCache=true",
]

# Public MBTA SharePoint folders holding the latest subway and bus ridership files.
RIDERSHIP_SUBWAY_SHARE_URL = (
    "https://mbta.sharepoint.com/:f:/s/PublicData/ElfNM8viGx5Out070Rg7tTABH1wLLEdwh69nIOb4J3Nt8w"
)
RIDERSHIP_BUS_SHARE_URL = "https://mbta.sharepoint.com/:f:/s/PublicData/Eh1G_O3dog9Eh_EfCqsJZ9EBb6BIgjP-ovWMwdLpwuDnjw"

# Leave as None to download the newest ridership files from the MBTA's SharePoint. Set to e.g.
# date(2021, 8, 8) to reuse ridership data already in datagen/ridership/.data instead.
RIDERSHIP_TARGET_DATE = None

# Local file paths for manually downloaded ridership data, used when PREFER_LOCAL_FILES is True
# e.g., "/path/to/MBTA Bus Weekly Ridership.xlsx"
LOCAL_BUS_XLSX_PATH = None
# e.g., "/path/to/2025.02.22 MBTA Gated Station Validations by line.csv"
LOCAL_SUBWAY_CSV_PATH = None
# e.g., date(2025, 2, 22) - date for the local files
LOCAL_RIDERSHIP_DATE = None

# Whether to prefer local files over SharePoint downloads
PREFER_LOCAL_FILES = False

# Last date of service and ridership to include. Defaults to the ridership data's date when None.
CUTOFF_DATE = None

# Patterns to find ridership files in the SharePoint folders.
RIDERSHIP_BUS_XLSX_REGEX = re.compile(r"^MBTA Bus Weekly Ridership\.xlsx$", re.I)
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
