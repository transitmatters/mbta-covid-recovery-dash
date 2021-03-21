from typing import List, Tuple, Dict
from dataclasses import dataclass
from datetime import datetime, date, timedelta
import json

from config import START_DATE, TIME_ZONE, OUTPUT_FILE

from gtfs.archive import load_feeds_and_service_levels_from_archive, GtfsFeed
from gtfs.time import date_from_string, date_to_string
from gtfs.util import bucket_by, get_date_ranges_of_same_value


@dataclass
class ServiceLevelsEntry:
    route_id: str
    service_levels: List[int]
    start_date: date
    end_date: date
    feed: GtfsFeed


def get_weekday_service_levels_history(feeds_and_service_levels: List[Tuple[GtfsFeed, Dict]]):
    histories = {}
    for (feed, service_levels) in feeds_and_service_levels:
        for route_id, service_dates in service_levels.items():
            history = histories.setdefault(route_id, [])
            weekday_service = service_dates["Weekday"]
            if len(weekday_service) > 0:
                for service_levels in weekday_service:
                    service_start_date = date_from_string(service_levels["startDate"])
                    trip_count = sum(service_levels["serviceLevels"])
                    history.append(
                        {
                            "date": service_start_date.strftime("%Y-%m-%d"),
                            "trips": trip_count,
                        }
                    )
            else:
                history.append({"date": feed.start_date.strftime("%Y-%m-%d"), "trips": 0})
    return histories


def get_service_level_entries_and_route_ids(feeds_and_service_levels: List[Tuple[GtfsFeed, Dict]]):
    entries = []
    all_route_ids = set()
    for feed, service_levels in feeds_and_service_levels:
        for route_id, service_level_date_ranges in service_levels.items():
            all_route_ids.add(route_id)
            for service_levels in service_level_date_ranges:
                entry = ServiceLevelsEntry(
                    route_id=route_id,
                    service_levels=service_levels["serviceLevels"],
                    start_date=date_from_string(service_levels["startDate"]),
                    end_date=date_from_string(service_levels["endDate"]),
                    feed=feed,
                )
                entries.append(entry)
    return bucket_by(entries, lambda e: e.route_id), all_route_ids


def get_service_level_history(unsorted_route_entries: List[ServiceLevelsEntry]):
    route_entries = sorted(unsorted_route_entries, key=lambda e: e.start_date, reverse=True)
    date = START_DATE
    today = datetime.now(TIME_ZONE).date()
    levels_by_date = {}
    while date <= today:
        matching_entries = [e for e in route_entries if e.start_date <= date and date <= e.end_date]
        if len(matching_entries) > 0:
            latest_entry = max(matching_entries, key=lambda e: e.feed.start_date)
            levels_by_date[date] = round(sum(latest_entry.service_levels))
        else:
            levels_by_date[date] = 0
        date += timedelta(days=1)
    date_ranges = []
    for (min_date, max_date), value in get_date_ranges_of_same_value(levels_by_date):
        if value == 0 and len(date_ranges) > 0 and (max_date - min_date) <= timedelta(days=2):
            date_ranges[-1]["endDate"] = date_to_string(max_date)
        else:
            date_ranges.append(
                {
                    "startDate": date_to_string(min_date),
                    "endDate": date_to_string(max_date),
                    "trips": value,
                }
            )
    return date_ranges


def generate_data_file():
    histories_by_route_id = {}
    feeds_and_service_levels = load_feeds_and_service_levels_from_archive()
    entries, route_ids = get_service_level_entries_and_route_ids(feeds_and_service_levels)
    for route_id in route_ids:
        histories_by_route_id[route_id] = get_service_level_history(entries[route_id])
    with open(OUTPUT_FILE, "w") as file:
        file.write(json.dumps(histories_by_route_id))


if __name__ == "__main__":
    generate_data_file()