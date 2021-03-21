from csv import DictReader
from os import path
from tqdm import tqdm


class GtfsLoader:
    def _loader_by_file_name(self, name: str):
        res = []
        file_path = path.join(self.root, name + ".txt")

        def load():
            with open(file_path, "r") as file:
                print(f"Reading {file_path}...")
                dict_reader = DictReader(file)
                for row in dict_reader:
                    res.append(row)
            return res

        return load

    def __init__(self, root: str):
        self.root = root
        self.load_calendar = self._loader_by_file_name("calendar")
        self.load_calendar_attributes = self._loader_by_file_name("calendar_attributes")
        self.load_calendar_dates = self._loader_by_file_name("calendar_dates")
        self.load_stop_times = self._loader_by_file_name("stop_times")
        self.load_stops = self._loader_by_file_name("stops")
        self.load_transfers = self._loader_by_file_name("transfers")
        self.load_trips = self._loader_by_file_name("trips")
        self.load_routes = self._loader_by_file_name("routes")
        self.load_route_patterns = self._loader_by_file_name("route_patterns")
        self.load_shapes = self._loader_by_file_name("shapes")
