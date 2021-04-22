from csv import DictReader
from dataclasses import dataclass
from datetime import datetime, date
from functools import cached_property
from os import path, mkdir
from zipfile import ZipFile
import pickle
import json

import requests
from tqdm import tqdm

from config import GTFS_ARCHIVE_URL, GTFS_DATA_PATH, START_DATE
from gtfs.loader import GtfsLoader
from gtfs.network import build_network_from_gtfs
from gtfs.trips import get_trip_summaries_for_network
from gtfs.service_levels import compute_service_levels_json
from gtfs.time import date_from_string, date_to_string


@dataclass
class GtfsFeed:
    start_date: date
    end_date: date
    url: str
    version: str

    @cached_property
    def subdirectory(self):
        return path.join(GTFS_DATA_PATH, date_to_string(self.start_date))

    def child_by_name(self, filename):
        return path.join(self.subdirectory, filename)

    @cached_property
    def gtfs_zip_path(self):
        return self.child_by_name("data.zip")

    @cached_property
    def gtfs_subdir_path(self):
        return self.child_by_name("feed")

    @cached_property
    def trip_summaries_pickle_path(self):
        return self.child_by_name("trip_summaries.pickle")

    @cached_property
    def service_levels_json_path(self):
        return self.child_by_name("service_levels.json")

    @cached_property
    def loader(self):
        return GtfsLoader(root=self.gtfs_subdir_path)


def download_gtfs_zip(feed: GtfsFeed):
    target_file = feed.gtfs_zip_path
    if path.exists(target_file):
        return
    if not path.exists(feed.subdirectory):
        mkdir(feed.subdirectory)
    response = requests.get(feed.url, stream=True)
    total_size_in_bytes = int(response.headers.get("content-length", 0))
    block_size = 1024
    progress_bar = tqdm(
        total=total_size_in_bytes, unit="iB", unit_scale=True, desc=f"Downloading {feed.url}"
    )
    with open(target_file, "wb") as file:
        for data in response.iter_content(block_size):
            progress_bar.update(len(data))
            file.write(data)
    progress_bar.close()


def extract_gtfs_zip(feed: GtfsFeed):
    if path.exists(feed.gtfs_subdir_path):
        return
    download_gtfs_zip(feed)
    print(f"Extracting {feed.url} to {feed.gtfs_subdir_path}")
    zf = ZipFile(feed.gtfs_zip_path)
    zf.extractall(feed.gtfs_subdir_path)


def get_trip_summaries(feed: GtfsFeed):
    extract_gtfs_zip(feed)
    pickle_path = feed.trip_summaries_pickle_path
    if path.exists(pickle_path):
        with open(pickle_path, "rb") as file:
            try:
                return pickle.load(file)
            except Exception:
                print("Error loading pickled trip summaries")
    print("Creating network from scratch...")
    network = build_network_from_gtfs(feed.loader)
    trip_summaries = get_trip_summaries_for_network(network)
    with open(pickle_path, "wb") as file:
        pickle.dump(trip_summaries, file)
    return trip_summaries


def get_service_levels_json(feed: GtfsFeed):
    target_path = feed.service_levels_json_path
    if not path.exists(target_path):
        print(f"Generating service_levels.json for {feed.url}")
        trip_summaries = get_trip_summaries(feed)
        service_levels_json = compute_service_levels_json(trip_summaries)
        with open(target_path, "w") as file:
            file.write(json.dumps(service_levels_json))
    with open(target_path, "r") as file:
        return json.loads(file.read())


def load_feeds_from_archive(load_start_date: date):
    feeds = []
    req = requests.get(GTFS_ARCHIVE_URL)
    lines = req.text.splitlines()
    reader = DictReader(lines, delimiter=",")
    for entry in reader:
        start_date = date_from_string(entry["feed_start_date"])
        end_date = date_from_string(entry["feed_end_date"])
        version = entry["feed_version"]
        url = entry["archive_url"]
        if start_date < load_start_date:
            continue
        gtfs_feed = GtfsFeed(start_date=start_date, end_date=end_date, version=version, url=url)
        feeds.append(gtfs_feed)
    return feeds


def load_feeds_and_service_levels_from_archive(load_start_date: date = START_DATE):
    for feed in load_feeds_from_archive(load_start_date):
        yield feed, get_service_levels_json(feed)


if __name__ == "__main__":
    if not path.exists(GTFS_DATA_PATH):
        mkdir(GTFS_DATA_PATH)
    feeds = load_feeds_from_archive(START_DATE)
    for feed in feeds:
        get_service_levels_json(feed)