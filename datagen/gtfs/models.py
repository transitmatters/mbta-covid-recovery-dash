from dataclasses import dataclass, field
from typing import List, Tuple, Dict, Optional
import functools
import datetime

DIRECTIONS = (0, 1)


class LocationType:
    STOP = "0"
    STATION = "1"


class VehicleType:
    LIGHT_RAIL = "0"
    SUBWAY = "1"
    COMMUTER_RAIL = "2"
    BUS = "3"
    FERRY = "4"


class ServiceExceptionType:
    ADDED = "1"
    REMOVED = "2"


@dataclass
class ServiceExceptionDate(object):
    date: datetime.date
    service_id: str
    exception_type: str


@dataclass(frozen=True)
class Service(object):
    id: str
    days: List[str]
    description: str
    schedule_name: str
    schedule_type: str
    schedule_typicality: int
    start_date: datetime.date
    end_date: datetime.date
    exception_dates: List[ServiceExceptionDate]

    def __hash__(self):
        return hash(self.id)


@dataclass
class Trip(object):
    id: str
    route_id: str
    route_pattern_id: str
    shape_id: str
    shape: List[Tuple[float, float]]
    direction_id: int
    service: Service
    stops: set[str]

    def __post_init__(self):
        self.stop_times = []

    def add_stop_time(self, stop_time):
        self.stop_times.append(stop_time)


@dataclass
class Direction(object):
    id: str
    route: "Route"
    direction: str
    destination: str


@dataclass
class StationStop(object):
    id: str
    name: str
    municipality: str
    location: Tuple[float, float]
    wheelchair_boarding: str
    on_street: str
    at_street: str
    vehicle_type: str
    zone_id: str
    level_id: str
    location_type: str


@dataclass
class Station(StationStop):
    def __str__(self):
        return f"Station({self.id})"

    def __post_init__(self):
        self.child_stops = []
        self.child_stops_by_direction = {}

    def add_child_stop(self, stop):
        self.child_stops.append(stop)

    def tag_child_stop_with_direction(self, stop, direction):
        assert stop in self.child_stops
        self.child_stops_by_direction[direction] = stop

    def get_child_stop_for_direction(self, direction):
        return self.child_stops_by_direction[direction]


@dataclass
class Stop(StationStop):
    parent_station: Station

    def __str__(self):
        return f"Stop({self.parent_station.id}.{self.id})"

    def __post_init__(self):
        self.stop_times = []
        self.transfers = []

    def set_stop_times(self, stop_times):
        self.stop_times = stop_times

    def add_transfer(self, transfer):
        self.transfers.append(transfer)


@functools.total_ordering
@dataclass
class StopTime(object):
    stop: Stop
    trip: Trip
    time: datetime.timedelta

    def __eq__(self, other):
        return self.time == other.time

    def __ne__(self, other):
        return self.time != other.time

    def __lt__(self, other):
        return self.time < other.time


@dataclass
class Transfer(object):
    from_stop: Stop
    to_stop: Stop
    min_walk_time: int
    min_wheelchair_time: int
    min_transfer_time: int
    suggested_buffer_time: int
    wheelchair_transfer: str


@dataclass
class Network(object):
    stations_by_id: Dict[str, Station]
    trips_by_id: Dict[str, Trip]
    shapes_by_id: Dict[str, List[Tuple[float, float]]]
    routes_by_id: Dict[str, "Route"]
    services_by_id: Dict[str, "Service"]
    lines_by_id: Dict[str, "Line"]

    def add_station(self, station: Station):
        existing_station_by_id = self.stations_by_id.get(station.id)
        if existing_station_by_id:
            raise NameError(f"Station with id {station.id} already exists in network")
        self.stations_by_id[station.id] = station
        return station

    def get_station_by_id(self, station_id: str) -> Optional[Station]:
        return self.stations_by_id.get(station_id)

    def get_station_by_name(self, station_name: str) -> Optional[Station]:
        for station in self.stations_by_id.values():
            if station.name == station_name:
                return station
        return None


@dataclass
class RoutePattern(object):
    id: str
    route: "Route"
    direction: int
    stops: List[Stop]


@dataclass
class Line(object):
    id: str
    short_name: str
    long_name: str
    desc: str
    url: str
    color: str
    text_color: str
    sort_order: str


@dataclass
class Route(object):
    id: str
    long_name: str
    representative_trip: Trip = None
    line: Line = None
    route_patterns: List[RoutePattern] = field(default_factory=list)

    def add_route_pattern(self, pattern: RoutePattern):
        self.route_patterns.append(pattern)
        pattern.route = self
