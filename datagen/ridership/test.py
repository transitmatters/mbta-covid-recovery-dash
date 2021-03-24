from datetime import date

from ridership.source import RidershipSource
from ridership.process import get_ridership_json

source = RidershipSource(download_date=date(2021, 3, 23))
json = get_ridership_json(source)