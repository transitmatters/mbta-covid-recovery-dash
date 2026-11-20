from functools import cached_property
from dataclasses import dataclass
from datetime import date
from os import path, makedirs
import shutil
import requests

from config import (
    RIDERSHIP_DATA_PATH,
    RIDERSHIP_SUBWAY_SHARE_URL,
    RIDERSHIP_BUS_SHARE_URL,
    RIDERSHIP_BUS_XLSX_REGEX,
    RIDERSHIP_SUBWAY_CSV_REGEX,
    RIDERSHIP_TARGET_DATE,
    CR_RIDERSHIP_ARCGIS_URL,
    CR_SEASONAL_RIDERSHIP_ARCGIS_URL,
    ARCGIS_UPDATE_CACHE_URLS,
    PREFER_LOCAL_FILES,
    LOCAL_BUS_XLSX_PATH,
    LOCAL_SUBWAY_CSV_PATH,
    LOCAL_RIDERSHIP_DATE,
)
from ridership.sharepoint import SharepointConnection, find_file, find_newest_dated_file

ARCGIS_TIMEOUT = 60  # seconds


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


def download_arcgis_csv(url: str, output_path: str):
    response = requests.get(url, timeout=ARCGIS_TIMEOUT)
    response.raise_for_status()
    with open(output_path, "wb") as file:
        file.write(response.content)


def download_cr_ridership(source: RidershipSource):
    for url in ARCGIS_UPDATE_CACHE_URLS:
        # Best effort: if the refresh fails, the last cached CSV still works.
        try:
            requests.get(url, timeout=ARCGIS_TIMEOUT).raise_for_status()
        except requests.RequestException as e:
            print(f"Couldn't refresh ArcGIS cache ({e}); using the cached CSV")
    download_arcgis_csv(CR_RIDERSHIP_ARCGIS_URL, source.cr_ridership_csv_path)
    download_arcgis_csv(CR_SEASONAL_RIDERSHIP_ARCGIS_URL, source.cr_seasonal_ridership_csv_path)


def get_local_ridership_source():
    source = RidershipSource(upload_date=LOCAL_RIDERSHIP_DATE)
    if not path.exists(source.subdirectory):
        makedirs(source.subdirectory)
        shutil.copyfile(LOCAL_SUBWAY_CSV_PATH, source.subway_ridership_csv_path)
        shutil.copyfile(LOCAL_BUS_XLSX_PATH, source.bus_ridership_xlsx_path)
        download_cr_ridership(source)
    return source


def get_sharepoint_ridership_source():
    sharepoint = SharepointConnection()
    subway_file_and_date = find_newest_dated_file(
        sharepoint.list_files(RIDERSHIP_SUBWAY_SHARE_URL), RIDERSHIP_SUBWAY_CSV_REGEX
    )
    bus_file = find_file(sharepoint.list_files(RIDERSHIP_BUS_SHARE_URL), RIDERSHIP_BUS_XLSX_REGEX)
    if not subway_file_and_date or not bus_file:
        raise Exception("Could not find subway and bus ridership files on SharePoint")
    subway_file, subway_date = subway_file_and_date
    # The bus file isn't dated, so the subway file's date names this snapshot.
    source = RidershipSource(upload_date=subway_date)
    if not path.exists(source.subdirectory):
        print(f"Downloading ridership data for {subway_date}")
        tmp_dir = source.subdirectory + ".tmp"
        shutil.rmtree(tmp_dir, ignore_errors=True)
        makedirs(tmp_dir)
        tmp_source = RidershipSource(upload_date=subway_date)
        tmp_source.subdirectory = tmp_dir
        sharepoint.download(subway_file, tmp_source.subway_ridership_csv_path)
        sharepoint.download(bus_file, tmp_source.bus_ridership_xlsx_path)
        download_cr_ridership(tmp_source)
        # Only move into place once everything downloaded, so a failed run isn't cached.
        shutil.move(tmp_dir, source.subdirectory)
    return source


def get_latest_ridership_source():
    if PREFER_LOCAL_FILES and LOCAL_BUS_XLSX_PATH and LOCAL_SUBWAY_CSV_PATH and LOCAL_RIDERSHIP_DATE:
        return get_local_ridership_source()
    if RIDERSHIP_TARGET_DATE:
        return RidershipSource(upload_date=RIDERSHIP_TARGET_DATE)
    return get_sharepoint_ridership_source()
