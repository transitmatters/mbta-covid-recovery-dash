from functools import cached_property
from dataclasses import dataclass
from datetime import date
from re import Pattern
from os import path, mkdir
from typing import List
from boxsdk import OAuth2, Client
from boxsdk.object.file import File

from config import (
    RIDERSHIP_DATA_PATH,
    RIDERSHIP_BOX_URL,
    RIDERSHIP_BUS_XLSX_REGEX,
    RIDERSHIP_SUBWAY_CSV_REGEX,
    RIDERSHIP_TARGET_DATE,
)
from secrets import BOX_ACCESS_TOKEN


@dataclass
class RidershipSource:
    upload_date: date

    @cached_property
    def subdirectory(self):
        return path.join(RIDERSHIP_DATA_PATH, self.upload_date.strftime("%Y%m%d"))

    @cached_property
    def subway_ridership_csv_path(self):
        return path.join(self.subdirectory, "subway.csv")

    @cached_property
    def bus_ridership_xlsx_path(self):
        return path.join(self.subdirectory, "bus.xlsx")

    @cached_property
    def ridership_json_path(self):
        return path.join(self.subdirectory, "ridership.json")


def get_box_client():
    oauth = OAuth2(client_id=None, client_secret=None, access_token=BOX_ACCESS_TOKEN)
    return Client(oauth=oauth)


def get_file_matching_date_pattern(files: List[File], pattern: Pattern):
    for file in files:
        match = pattern.match(file.name)
        if match:
            year = match[1]
            month = match[2]
            day = match[3]
            file_date = date(year=int(year), month=int(month), day=int(day))
            return file, file_date


def get_latest_ridership_source(require_matching_bus_subway_dates=False):
    if RIDERSHIP_TARGET_DATE:
        return RidershipSource(upload_date=RIDERSHIP_TARGET_DATE)
    client = get_box_client()
    folder = client.get_shared_item(RIDERSHIP_BOX_URL)
    files = list(folder.get_items())
    maybe_bus_file_and_date = get_file_matching_date_pattern(files, RIDERSHIP_BUS_XLSX_REGEX)
    maybe_subway_file_and_date = get_file_matching_date_pattern(files, RIDERSHIP_SUBWAY_CSV_REGEX)
    if maybe_bus_file_and_date and maybe_subway_file_and_date:
        subway_file, subway_date = maybe_subway_file_and_date
        bus_file, bus_date = maybe_bus_file_and_date
        assert (
            not require_matching_bus_subway_dates or bus_date == subway_date
        ), f"Mismatched file dates: {bus_date} and {subway_date}"
        source = RidershipSource(upload_date=subway_date)
        if not path.exists(source.subdirectory):
            mkdir(source.subdirectory)
            with open(source.subway_ridership_csv_path, "wb") as file:
                subway_file.download_to(file)
            with open(source.bus_ridership_xlsx_path, "wb") as file:
                bus_file.download_to(file)
        return source
    raise Exception("Could not load ridership data!")
