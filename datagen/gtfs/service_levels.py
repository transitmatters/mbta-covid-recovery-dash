from collections import Counter
from datetime import date, timedelta
from typing import List, Dict

from gtfs.models import Service, ServiceExceptionType
from gtfs.trips import TripSummary
from gtfs.util import bucket_by, get_date_ranges_of_same_value
from gtfs.time import date_to_string, DAYS_OF_WEEK


def count_route_id(route_id: str):
    # 602 is a Green Line shuttle
    return not route_id.startswith("Shuttle") and route_id != "602"


def service_runs_on_date(service: Service, date: date):
    return (
        service.start_date <= date <= service.end_date
        and DAYS_OF_WEEK[date.weekday()] in service.days
        and not any(
            (
                ed.date == date and ed.exception_type == ServiceExceptionType.REMOVED
                for ed in service.exception_dates
            )
        )
    )


def get_exception_date_strings_for_services(services: List[Service]):
    dates = [
        date_to_string(exception_date.date)
        for service in services
        for exception_date in service.exception_dates
    ]
    return sorted(set(dates))


def bucket_trips_by_hour(trips: List[TripSummary]):
    by_time_of_day = [0] * 24
    for trip in trips:
        hour = (trip.departure_time.seconds // 3600) % 24
        by_time_of_day[hour] += 0.5
    return by_time_of_day

# Given a list of trips on a single date, prune to match a more realistic service level
def filter_trips_serving_most_common_stop(trips: List[TripSummary]):
    accepted: List[TripSummary] = []
    trips_by_route_id = bucket_by(trips, "route_id")

    for trips in trips_by_route_id.values():
        # What the route id actually is doesn't matter, as long as it's bucketed
        count = Counter([list(trip.stop_ids) for trip in trips])
        [(most_serviced_stop, )] = count.most_common(1)
        accepted.extend(
            filter(lambda trip: most_serviced_stop in trip.stop_ids, trips)
        )

    return accepted

def summarize_trips_by_date(line_id: str, trips: List[TripSummary]):
    summary_by_date = {}
    services = set((t.service for t in trips))
    valid_route_ids = set((t.route_id for t in trips if count_route_id(t.route_id)))
    exemplar_trip = trips[-1]
    earliest_service_date = min((s.start_date for s in services))
    latest_service_date = max((s.end_date for s in services))
    date = earliest_service_date
    while date <= latest_service_date:
        services_for_date = [s for s in services if service_runs_on_date(s, date)]
        trips_for_date = [
            t for t in trips if t.service in services_for_date and t.route_id in valid_route_ids
        ]
        pruned_trips = filter_trips_serving_most_common_stop(trips_for_date)
        summary_by_date[date] = bucket_trips_by_hour(pruned_trips)
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
        "routeIds": list(valid_route_ids),
        "shortName": exemplar_trip.line.short_name,
        "longName": exemplar_trip.line.long_name,
        "exceptionDates": get_exception_date_strings_for_services(services),
        "history": reduced_summary,
    }


def compute_service_levels_json(trips: List[TripSummary]):
    trips_by_line_id = bucket_by(trips, lambda t: t.line.id)
    return {
        line_id: summarize_trips_by_date(line_id, trips_for_line_id)
        for line_id, trips_for_line_id in trips_by_line_id.items()
    }
