from functools import cached_property
from dataclasses import dataclass
from datetime import date
from re import Pattern
from os import path, mkdir
from typing import List
from boxsdk import OAuth2, Client
from boxsdk.object.file import File
import requests

from config import (
    RIDERSHIP_DATA_PATH,
    RIDERSHIP_BOX_URL,
    RIDERSHIP_BUS_XLSX_REGEX,
    RIDERSHIP_SUBWAY_CSV_REGEX,
    RIDERSHIP_TARGET_DATE,
    CR_RIDERSHIP_ARCGIS_URL,
    CR_SEASONAL_RIDERSHIP_ARCGIS_URL,
    PREFER_LOCAL_FILES,
    LOCAL_BUS_XLSX_PATH,
    LOCAL_SUBWAY_CSV_PATH,
    LOCAL_RIDERSHIP_DATE,
)
from secret_values import BOX_ACCESS_TOKEN


@dataclass
class RidershipSource:
    upload_date: date

    @cached_property
    def bus_sheet_name(self):
        return "Ridership by Route" if self.upload_date < date(2025, 5, 1) else "Weekly by Route"

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
    def cr_ridership_csv_path(self):
        return path.join(self.subdirectory, "cr.csv")

    @cached_property
    def cr_seasonal_ridership_csv_path(self):
        return path.join(self.subdirectory, "cr_seasonal.csv")

    @cached_property
    def ridership_json_path(self):
        return path.join(self.subdirectory, "ridership.json")


def get_box_client():
    oauth = OAuth2(
        client_id=None,
        client_secret=None,
        access_token=BOX_ACCESS_TOKEN,
    )
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
    # Prefer local files if configured
    if PREFER_LOCAL_FILES and LOCAL_BUS_XLSX_PATH and LOCAL_SUBWAY_CSV_PATH and LOCAL_RIDERSHIP_DATE:
        source = RidershipSource(upload_date=LOCAL_RIDERSHIP_DATE)
        if not path.exists(source.subdirectory):
            mkdir(source.subdirectory)
            # Copy local files into the expected subdirectory
            with open(LOCAL_SUBWAY_CSV_PATH, "rb") as src, open(source.subway_ridership_csv_path, "wb") as dst:
                dst.write(src.read())
            with open(LOCAL_BUS_XLSX_PATH, "rb") as src, open(source.bus_ridership_xlsx_path, "wb") as dst:
                dst.write(src.read())
            with open(source.cr_ridership_csv_path, "wb") as file:
                req = requests.get(CR_RIDERSHIP_ARCGIS_URL)
                file.write(req.content)
            with open(source.cr_seasonal_ridership_csv_path, "wb") as file:
                req = requests.get(CR_SEASONAL_RIDERSHIP_ARCGIS_URL)
                file.write(req.content)
        return source
    # Fallback to Box or RIDERSHIP_TARGET_DATE
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
            with open(source.cr_ridership_csv_path, "wb") as file:
                req = requests.get(CR_RIDERSHIP_ARCGIS_URL)
                file.write(req.content)
            with open(source.cr_seasonal_ridership_csv_path, "wb") as file:
                req = requests.get(CR_SEASONAL_RIDERSHIP_ARCGIS_URL)
                file.write(req.content)
        return source
    raise Exception("Could not load ridership data!")
