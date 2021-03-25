from typing import List, Dict
from datetime import date, timedelta

from gtfs.models import Service
from gtfs.trips import TripSummary
from gtfs.util import bucket_by, get_date_ranges_of_same_value
from gtfs.time import date_to_string, DAYS_OF_WEEK


def normalize_route_id(route_id: str):
    route_id_lower = route_id.lower()
    if route_id_lower.startswith("green"):
        return "Green"
    if route_id in ("741", "742", "743", "751", "749", "746"):
        return "Silver"
    return route_id


def service_runs_on_date(service: Service, date: date):
    return (
        service.start_date <= date <= service.end_date
        and date not in service.exception_dates
        and DAYS_OF_WEEK[date.weekday()] in service.days
    )


def get_exception_date_strings_for_services(services: List[Service]):
    dates = [date_to_string(date) for service in services for date in service.exception_dates]
    return sorted(set(dates))


def bucket_trips_by_hour(trips: List[TripSummary]):
    by_time_of_day = [0] * 24
    for trip in trips:
        hour = (trip.departure_time.seconds // 3600) % 24
        by_time_of_day[hour] += 0.5
    return by_time_of_day


def summarize_trips_by_date(route_id: str, trips: List[TripSummary]):
    summary_by_date = {}
    services = set((t.service for t in trips))
    earliest_service_date = min((s.start_date for s in services))
    latest_service_date = max((s.end_date for s in services))
    date = earliest_service_date

    while date <= latest_service_date:
        date_string = date_to_string(date)
        services_for_date = [s for s in services if service_runs_on_date(s, date)]
        trips_for_date = [t for t in trips if t.service in services_for_date]
        summary_by_date[date] = bucket_trips_by_hour(trips_for_date)
        date += timedelta(days=1)

    reduced_summary = []
    for (min_date, max_date), value in get_date_ranges_of_same_value(summary_by_date):
        summary_dict = {
            "startDate": date_to_string(min_date),
            "endDate": date_to_string(max_date),
            "serviceLevels": value,
        }
        reduced_summary.append(summary_dict)
    return {
        "history": reduced_summary,
        "exceptionDates": get_exception_date_strings_for_services(services),
    }


def compute_service_levels_json(trips: List[TripSummary]):
    trips_by_route_id = bucket_by(trips, lambda t: normalize_route_id(t.route_id))
    return {
        route_id: summarize_trips_by_date(route_id, trips_for_route_id)
        for route_id, trips_for_route_id in trips_by_route_id.items()
    }
