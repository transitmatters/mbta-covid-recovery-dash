from gtfs.loader import GtfsLoader
from gtfs.models import (
    StopTime,
    Station,
    Stop,
    LocationType,
    Network,
    Transfer,
    Trip,
    Line,
    Service,
    ServiceExceptionDate,
    Route,
    RoutePattern,
)
from gtfs.time import time_from_string, date_from_string, DAYS_OF_WEEK
from gtfs.util import index_by, bucket_by


def get_shapes_by_id(shapes):
    res = {}
    for shape in shapes:
        shape_id = shape["shape_id"]
        if not res.get(shape_id):
            res[shape_id] = []
        lat = float(shape["shape_pt_lat"])
        lon = float(shape["shape_pt_lon"])
        seq = int(shape["shape_pt_sequence"])
        res[shape_id].append((lat, lon, seq))
    for shape_id in res:
        res[shape_id] = [
            (lat, lon) for (lat, lon, _) in sorted(res[shape_id], key=lambda entry: entry[2])
        ]
    return res


def get_lines_by_id(line_dicts):
    res = {}
    for line_dict in line_dicts:
        line_id = line_dict["line_id"]
        line = Line(
            id=line_id,
            short_name=line_dict["line_short_name"],
            long_name=line_dict["line_long_name"],
            desc=line_dict["line_desc"],
            url=line_dict["line_url"],
            color=line_dict["line_color"],
            text_color=line_dict["line_text_color"],
            sort_order=line_dict["line_sort_order"],
        )
        res[line_id] = line
    return res


def get_service_exception_dates_for_service_id(service_id, calendar_date_dicts):
    dates = []
    for date_dict in calendar_date_dicts:
        if date_dict["service_id"] == service_id:
            exception_date = date_from_string(date_dict["date"])
            exception_type = date_dict["exception_type"]
            service_exception_date = ServiceExceptionDate(
                date=exception_date,
                service_id=service_id,
                exception_type=exception_type,
            )
            dates.append(service_exception_date)
    return dates


def link_services(calendar_dicts, calendar_attribute_dicts, calendar_date_dicts):
    services = []
    calendar_attributes_by_id = index_by(calendar_attribute_dicts, "service_id")
    for calendar_dict in calendar_dicts:
        service_id = calendar_dict["service_id"]
        attribute_dict = calendar_attributes_by_id[service_id]
        services.append(
            Service(
                id=service_id,
                days=[day for day in DAYS_OF_WEEK if calendar_dict[day] == "1"],
                description=attribute_dict["service_description"],
                schedule_name=attribute_dict["service_schedule_name"],
                schedule_type=attribute_dict["service_schedule_type"],
                schedule_typicality=int(attribute_dict["service_schedule_typicality"]),
                start_date=date_from_string(calendar_dict["start_date"]),
                end_date=date_from_string(calendar_dict["end_date"]),
                exception_dates=get_service_exception_dates_for_service_id(
                    service_id,
                    calendar_date_dicts,
                ),
            )
        )
    return index_by(services, lambda s: s.id)


def get_stations_from_stops(stop_dicts):
    for stop_dict in stop_dicts:
        if stop_dict["location_type"] == LocationType.STATION:
            yield stop_dict


def get_station_stop_args_from_dict(stop_dict):
    return {
        "id": stop_dict["stop_id"],
        "name": stop_dict["stop_name"],
        "municipality": stop_dict["municipality"],
        "location": (float(stop_dict["stop_lat"]), float(stop_dict["stop_lon"])),
        "wheelchair_boarding": stop_dict["wheelchair_boarding"],
        "on_street": stop_dict["on_street"],
        "at_street": stop_dict["at_street"],
        "vehicle_type": stop_dict["vehicle_type"],
        "zone_id": stop_dict["zone_id"],
        "level_id": stop_dict["level_id"],
        "location_type": stop_dict["location_type"],
    }


def link_station(station_dict):
    return Station(**get_station_stop_args_from_dict(station_dict))


def link_trips(trip_dicts, services_by_id, shapes_by_id):
    res = {}
    for trip_dict in trip_dicts:
        trip_id = trip_dict["trip_id"]
        matching_service = services_by_id.get(trip_dict["service_id"])
        # Throw out special services with no regularly scheduled service days
        if matching_service and len(matching_service.days) > 0:
            trip = Trip(
                id=trip_dict["trip_id"],
                service=matching_service,
                route_id=trip_dict["route_id"],
                route_pattern_id=trip_dict["route_pattern_id"],
                direction_id=int(trip_dict["direction_id"]),
                shape_id=trip_dict["shape_id"],
                shape=shapes_by_id[trip_dict["shape_id"]],
                stops=set(),
            )
            res[trip_id] = trip
    return res


def link_stop_times(stop, stop_time_dicts_for_stop_id, trips_by_id):
    stop_times = []
    added = 0
    for stop_time_dict in stop_time_dicts_for_stop_id:
        assert stop_time_dict["stop_id"] == stop.id
        trip = trips_by_id.get(stop_time_dict["trip_id"])
        if trip:
            stop_time = StopTime(
                stop=stop,
                trip=trip,
                time=time_from_string(stop_time_dict["departure_time"]),
            )
            trip.stops.add(stop.id)
            added += 1
            stop_times.append(stop_time)
            trip.add_stop_time(stop_time)
    stop.set_stop_times(sorted(stop_times))


def link_stops(stations_by_id, stop_dicts):
    stops = []
    for stop_dict in stop_dicts:
        parent_station_id = stop_dict["parent_station"]
        parent_station = stations_by_id.get(parent_station_id)
        if stop_dict["location_type"] == LocationType.STOP:
            stop = Stop(parent_station=parent_station, **get_station_stop_args_from_dict(stop_dict))
            stops.append(stop)
            if parent_station:
                parent_station.add_child_stop(stop)
    return stops


def link_transfers(stop, all_stops, transfer_dicts_for_from_stop_id):
    for transfer_dict in transfer_dicts_for_from_stop_id:
        assert transfer_dict["from_stop_id"] == stop.id
        to_stop = next(
            (
                other_stop
                for other_stop in all_stops
                if other_stop.id == transfer_dict["to_stop_id"]
            ),
            None,
        )
        if to_stop:
            transfer = Transfer(
                from_stop=stop,
                to_stop=to_stop,
                min_walk_time=int(transfer_dict["min_walk_time"] or 0),
                min_wheelchair_time=int(transfer_dict["min_wheelchair_time"] or 0),
                min_transfer_time=int(transfer_dict["min_transfer_time"] or 0),
                suggested_buffer_time=int(transfer_dict["suggested_buffer_time"] or 0),
                wheelchair_transfer=transfer_dict["wheelchair_transfer"],
            )
            stop.add_transfer(transfer)


def link_routes(route_dicts, route_pattern_dicts, lines_by_id):
    routes = []
    for route_dict in route_dicts:
        route_id = route_dict["route_id"]
        route = Route(
            id=route_id,
            long_name=route_dict["route_long_name"],
            line=lines_by_id.get(route_dict["line_id"]),
        )
        matching_route_patterns = [
            route_pattern_dict
            for route_pattern_dict in route_pattern_dicts
            if route_pattern_dict["route_id"] == route_id
        ]
        for route_pattern_dict in matching_route_patterns:
            route.route_patterns.append(
                RoutePattern(
                    id=route_pattern_dict["route_pattern_id"],
                    route=route,
                    direction=int(route_pattern_dict["direction_id"]),
                    # TODO(ian): consider filling this in
                    stops=[],
                )
            )
        routes.append(route)
    return index_by(routes, lambda r: r.id)


def ensure_trips_are_sorted(trips_by_id):
    for trip in trips_by_id.values():
        trip.stop_times = list(sorted(trip.stop_times, key=lambda st: st.time))


def build_network_from_gtfs(loader: GtfsLoader):
    # Do the loading...
    calendar_dicts = loader.load_calendar()
    calendar_attribute_dicts = loader.load_calendar_attributes()
    calendar_date_dicts = loader.load_calendar_dates()
    stop_dicts = loader.load_stops()
    stop_time_dicts = loader.load_stop_times()
    transfer_dicts = loader.load_transfers()
    trip_dicts = loader.load_trips()
    route_dicts = loader.load_routes()
    route_pattern_dicts = loader.load_route_patterns()
    line_dicts = loader.load_lines()
    shapes = loader.load_shapes()
    print("Loaded entities")
    # Now do the linking...
    station_dicts = get_stations_from_stops(stop_dicts)
    print("Linking services...")
    services_by_id = link_services(calendar_dicts, calendar_attribute_dicts, calendar_date_dicts)
    print("Linking routes...")
    lines_by_id = get_lines_by_id(line_dicts)
    routes_by_id = link_routes(route_dicts, route_pattern_dicts, lines_by_id)
    print("Linking trips...")
    shapes_by_id = get_shapes_by_id(shapes)
    trips_by_id = link_trips(trip_dicts, services_by_id, shapes_by_id)
    stations = [link_station(d) for d in station_dicts]
    stations_by_id = index_by(stations, lambda st: st.id)
    print("Linking stops...")
    stops = link_stops(stations_by_id, stop_dicts)
    stop_time_dicts_by_stop_id = bucket_by(stop_time_dicts, "stop_id")
    transfer_dicts_by_from_stop_id = bucket_by(transfer_dicts, "from_stop_id")
    print("Linking stop times...")
    for stop in stops:
        stop_times_for_id = stop_time_dicts_by_stop_id.get(stop.id)
        if stop_times_for_id and len(stop_times_for_id) > 0:
            # print(f"...for {stop.name} ({len(stop_times_for_id)})")
            link_stop_times(stop, stop_times_for_id, trips_by_id)
    # print("Linking transfers...")
    # for stop in stops:
    #     transfers_for_id = transfer_dicts_by_from_stop_id.get(stop.id)
    #     if transfers_for_id and len(transfers_for_id) > 0:
    #         # print(f"...for {stop.name} ({len(transfers_for_id)})")
    #         link_transfers(stop, stops, transfers_for_id)
    print("Sorting trips...")
    ensure_trips_are_sorted(trips_by_id)
    return Network(
        stations_by_id=stations_by_id,
        trips_by_id=trips_by_id,
        shapes_by_id=shapes_by_id,
        routes_by_id=routes_by_id,
        services_by_id=services_by_id,
        lines_by_id=lines_by_id,
    )
