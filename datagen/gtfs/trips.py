from dataclasses import dataclass
import datetime

from gtfs.models import Network, Service, Line


@dataclass
class TripSummary:
    id: str
    route_id: str
    route_pattern_id: str
    service: Service
    line: Line
    departure_time: datetime.timedelta
    stops: set


def get_trip_summaries_for_network(network: Network):
    summaries = []
    for trip in network.trips_by_id.values():
        summary = TripSummary(
            id=trip.id,
            route_id=trip.route_id,
            route_pattern_id=trip.route_pattern_id,
            service=trip.service,
            line=network.routes_by_id[trip.route_id].line,
            departure_time=trip.stop_times[0].time,
            stops=trip.stops,
        )
        summaries.append(summary)
    return summaries
