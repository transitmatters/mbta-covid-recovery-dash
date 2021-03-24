from functools import cached_property
from dataclasses import dataclass
from datetime import date
from os import path

from config import RIDERSHIP_DATA_PATH


@dataclass
class RidershipSource:
    download_date: date

    @cached_property
    def subdirectory(self):
        return path.join(RIDERSHIP_DATA_PATH, self.download_date.strftime("%Y%m%d"))

    @cached_property
    def subway_ridership_csv_path(self):
        return path.join(self.subdirectory, "subway.csv")

    @cached_property
    def bus_ridership_xlsx_path(self):
        return path.join(self.subdirectory, "bus.xlsx")

    @cached_property
    def ridership_json_path(self):
        return path.join(self.subdirectory, "ridership.json")
