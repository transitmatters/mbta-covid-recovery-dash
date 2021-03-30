from typing import List, Tuple, Dict
from dataclasses import dataclass
from datetime import datetime, date, timedelta
import json

from config import START_DATE, TIME_ZONE, OUTPUT_FILE, PRE_COVID_DATE, RECENT_SERVICE_CUTS_DATE

from gtfs.archive import load_feeds_and_service_levels_from_archive, GtfsFeed
from gtfs.time import date_from_string, date_to_string
from gtfs.util import bucket_by, get_date_ranges_of_same_value
from ridership.source import RidershipSource
from ridership.timeseries import get_ridership_time_series_by_id


@dataclass
class ServiceLevelsEntry:
    route_id: str
    service_levels: List[int]
    exception_dates: List[date]
    start_date: date
    end_date: date
    feed: GtfsFeed


def get_route_kind(route_id: str):
    lower_id = route_id.lower()
    if lower_id in ("red", "orange", "blue", "silver", "green"):
        return lower_id
    if lower_id.startswith("cr-"):
        return "regional-rail"
    return "bus"


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
        for route_id, route_entry in service_levels.items():
            all_route_ids.add(route_id)
            service_level_history = route_entry["history"]
            exception_dates = list(map(date_from_string, route_entry["exceptionDates"]))
            for service_levels in service_level_history:
                entry = ServiceLevelsEntry(
                    route_id=route_id,
                    service_levels=service_levels["serviceLevels"],
                    start_date=date_from_string(service_levels["startDate"]),
                    end_date=date_from_string(service_levels["endDate"]),
                    exception_dates=exception_dates,
                    feed=feed,
                )
                entries.append(entry)
    return bucket_by(entries, lambda e: e.route_id), all_route_ids


def get_service_levels_entry_for_date(entries: List[ServiceLevelsEntry], date: date):
    matching_entries = [e for e in entries if e.start_date <= date <= e.end_date]
    if len(matching_entries) > 0:
        # if matching_entries[0].route_id == "24" and date.year == 2020 and date.month < 8:
        #     print(f"==== {date_to_string(date)} ====")
        #     for me in matching_entries:
        #         print(
        #             date_to_string(me.start_date),
        #             date_to_string(me.end_date),
        #             sum(me.service_levels),
        #             me.feed.url,
        #         )
        return max(matching_entries, key=lambda e: e.feed.start_date)
    return None


def get_service_level_history(entries: List[ServiceLevelsEntry], start_date: date, end_date: date):
    levels_by_date = {}
    date = start_date
    while date <= end_date:
        entry = get_service_levels_entry_for_date(entries, date)
        levels_by_date[date] = round(sum(entry.service_levels)) if entry else 0
        date += timedelta(days=1)
    values = []
    for (min_date, max_date), value in get_date_ranges_of_same_value(levels_by_date):
        range_length_days = 1 + (max_date - min_date).days
        is_weekend = range_length_days <= 2 and all(
            (d.weekday() in (5, 6) for d in (min_date, max_date))
        )
        fill_hole = value == 0 and range_length_days <= 5
        value_to_append = values[-1] if len(values) and (fill_hole or is_weekend) else value
        values += range_length_days * [value_to_append]
    return values


def get_exemplar_service_levels_for_lookback_date(
    entries: List[ServiceLevelsEntry],
    start_lookback_date: date,
    matching_days_of_week: List[int],
):
    date = start_lookback_date
    while date >= START_DATE:
        entry = get_service_levels_entry_for_date(entries, date)
        if entry and not date in entry.exception_dates and date.weekday() in matching_days_of_week:
            return entry.service_levels
        date -= timedelta(days=1)
    return None


def service_is_cancelled(
    entries: List[ServiceLevelsEntry],
    start_lookback_date: date,
    matching_days_of_week: List[int],
):
    most_recent_matching_date = start_lookback_date
    while most_recent_matching_date.weekday() not in matching_days_of_week:
        most_recent_matching_date -= timedelta(days=1)
    entry = get_service_levels_entry_for_date(entries, most_recent_matching_date)
    return entry is None


def get_service_levels_summary_dict(
    entries: List[ServiceLevelsEntry],
    start_lookback_date: date,
    matching_days_of_week: List[int],
):
    if service_is_cancelled(entries, start_lookback_date, matching_days_of_week):
        return {"cancelled": True, "tripsPerHour": None, "totalTrips": 0}
    trips_per_hour = get_exemplar_service_levels_for_lookback_date(
        entries,
        start_lookback_date,
        matching_days_of_week,
    )
    total_trips = round(sum(trips_per_hour)) if trips_per_hour else 0
    return {"cancelled": False, "tripsPerHour": trips_per_hour, "totalTrips": total_trips}


def get_service_regime_dict(entries: List[ServiceLevelsEntry], start_lookback_date: date):
    return {
        "weekday": get_service_levels_summary_dict(entries, start_lookback_date, list(range(0, 5))),
        "saturday": get_service_levels_summary_dict(entries, start_lookback_date, [5]),
        "sunday": get_service_levels_summary_dict(entries, start_lookback_date, [6]),
    }


def count_total_trips(regime_dict):
    return (
        regime_dict["weekday"]["totalTrips"]
        + regime_dict["saturday"]["totalTrips"]
        + regime_dict["sunday"]["totalTrips"]
    )


def summarize_service(numerator_regime_dict, denominator_regime_dict):
    numerator_total_trips = count_total_trips(numerator_regime_dict)
    denominator_total_trips = count_total_trips(denominator_regime_dict)
    try:
        total_trips_fraction = numerator_total_trips / denominator_total_trips
    except ZeroDivisionError:
        total_trips_fraction = 0
    return numerator_total_trips, total_trips_fraction


def generate_data_file():
    today = datetime.now(TIME_ZONE).date()
    ridership_source = RidershipSource(download_date=date(2021, 3, 23))
    data_by_route_id = {}
    feeds_and_service_levels = load_feeds_and_service_levels_from_archive()
    entries, route_ids = get_service_level_entries_and_route_ids(feeds_and_service_levels)
    ridership_time_series_by_route_id = get_ridership_time_series_by_id(
        ridership_source,
        START_DATE,
        today,
    )
    for route_id in route_ids:
        entries_for_route_id = entries[route_id]
        ridership_time_series = ridership_time_series_by_route_id.get(route_id)
        service_time_series = get_service_level_history(entries_for_route_id, START_DATE, today)
        baseline_service_regime = get_service_regime_dict(entries_for_route_id, PRE_COVID_DATE)
        current_service_regime = get_service_regime_dict(entries_for_route_id, today)
        total_trips, service_fraction = summarize_service(
            current_service_regime,
            baseline_service_regime,
        )
        data_by_route_id[route_id] = {
            "id": route_id,
            "startDate": START_DATE.strftime("%Y-%m-%d"),
            "routeKind": get_route_kind(route_id),
            "ridershipHistory": ridership_time_series,
            "serviceHistory": service_time_series,
            "serviceFraction": service_fraction,
            "totalTrips": total_trips,
            "serviceRegimes": {
                "baseline": baseline_service_regime,
                "current": current_service_regime,
            },
        }
    with open(OUTPUT_FILE, "w") as file:
        file.write(json.dumps(data_by_route_id))


if __name__ == "__main__":
    generate_data_file()