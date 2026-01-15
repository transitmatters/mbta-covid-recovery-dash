import json
import pandas as pd
import numpy as np
from datetime import timedelta
from os import path
from typing import Dict, Union
from pandas.tseries.holiday import USFederalHolidayCalendar

from config import PRE_COVID_DATE
from ridership.source import RidershipSource

unofficial_bus_labels_map = {
    # Silver Line
    "SL1": "741",
    "SL2": "742",
    "SL3": "743",
    "SL4": "751",
    "SL5": "749",
    "SLW": "746",
}

unofficial_cr_labels_map = {
    # Commuter Rail
    "Fitchburg": "CR-Fitchburg",
    "Needham": "CR-Needham",
    "Greenbush": "CR-Greenbush",
    "Fairmount": "CR-Fairmount",
    "Providence/Stoughton": "CR-Providence",
    "Newburyport/Rockport": "CR-Newburyport",
    "Framingham/Worcester": "CR-Worcester",
    "Franklin/Foxboro": "CR-Franklin",
    "Middleborough/Lakeville": "CR-Middleborough",
    "Lowell": "CR-Lowell",
    "Haverhill": "CR-Haverhill",
    "Kingston": "CR-Kingston",
    "Fall.River/New.Bedford": "CR-NewBedford",
}


def format_ridership_csv(
    path_to_csv_file: str,
    date_key: str,
    route_key: str,
    count_key: str,
    route_ids_map: Union[None, Dict[str, str]] = None,
):
    # read data, convert to datetime
    df = pd.read_csv(path_to_csv_file)
    df[date_key] = pd.to_datetime(df[date_key])

    # add holidays
    cal = USFederalHolidayCalendar()
    holidays = cal.holidays(start=df[date_key].min(), end=df[date_key].max())

    # mark as holiday and weekday
    df["holiday"] = df[date_key].dt.date.astype("datetime64").isin(holidays.date)
    df["weekday"] = df[date_key].dt.dayofweek

    # define peak, mark weekdays, convert service date back
    conditions = [(df["holiday"] == False) & (df["weekday"] < 5)]
    choices = ["peak"]
    df["peak"] = np.select(conditions, choices, default="offpeak")
    df["week"] = df[date_key].dt.isocalendar().week
    df["year"] = df[date_key].dt.isocalendar().year
    df[date_key] = df[date_key].dt.date.astype(str)

    # select date of the week
    dates = df[df["weekday"] == 0]
    dates = dates[[date_key, "week", "year"]].drop_duplicates()

    # limit data to just peak, merge back dates
    final = df[df["peak"] == "peak"]

    final = final.groupby(["year", "week", route_key])[count_key].mean().round().reset_index()

    final = final.merge(dates, on=["week", "year"], how="left")

    # get list of routes
    routelist = list(set(final[route_key].tolist()))

    # create dict
    output = {}

    # write out each set of routes to dict
    for route in routelist:
        for_route = final[final[route_key] == route]
        only_date_and_count = for_route[[date_key, count_key]].dropna()
        # ensure all values are numeric, NULL/invalid to 0
        only_date_and_count[count_key] = pd.to_numeric(only_date_and_count[count_key], errors="coerce").fillna(0)
        dictdata = only_date_and_count.rename(columns={date_key: "date", count_key: "riders"}).to_dict(orient="records")
        route_id = route_ids_map[route] if route_ids_map else route
        output[route_id] = dictdata
    return output


def get_baseline_daily_boardings_by_cr_route(path_to_csv_file: str):
    # get CR baseline boardings from seasonal file
    try:
        df = pd.read_csv(path_to_csv_file)
        df = df[(df["season"] == "Spring 2018") & (df["day_type_name"] == "weekday")]
        df = df[["route_id", "average_ons"]]
        merged = (
            df.groupby(df["route_id"])
            .aggregate({"route_id": "first", "average_ons": "sum"})
            .rename(columns={"average_ons": "boardings"})
        )
        out_dict = {}
        for entry in merged.to_dict(orient="records"):
            out_dict[entry["route_id"]] = int(entry["boardings"])
        return out_dict
    except Exception:
        # If file is missing or empty, return 0 for all known CR routes
        return {k: 0 for k in unofficial_cr_labels_map.values()}


def format_subway_data(path_to_csv_file: str):
    return format_ridership_csv(
        path_to_csv_file=path_to_csv_file,
        date_key="servicedate",
        route_key="route_or_line",
        count_key="validations",
    )


def format_cr_data(path_to_ridershp_file: str, path_to_seasonal_ridership_file: str):
    # format CR data, fallback to 0 for missing baselines
    baselines = get_baseline_daily_boardings_by_cr_route(path_to_seasonal_ridership_file)
    ridership_by_route = format_ridership_csv(
        path_to_csv_file=path_to_ridershp_file,
        date_key="servicedate",
        route_key="line",
        count_key="estimated_boardings",
        route_ids_map=unofficial_cr_labels_map,
    )
    with_baselines = {}
    for route_id, route_dates in ridership_by_route.items():
        baseline = baselines.get(route_id, 0)
        # ensure all values are numeric, NULL/invalid to 0
        for entry in route_dates:
            entry["riders"] = float(entry["riders"]) if str(entry["riders"]).replace(".", "", 1).isdigit() else 0
        with_baselines[route_id] = [
            {
                "date": PRE_COVID_DATE.strftime("%Y-%m-%d"),
                "riders": baseline,
            },
            {
                "date": (PRE_COVID_DATE + timedelta(days=1)).strftime("%Y-%m-%d"),
                "riders": 0,
            },
            *route_dates,
        ]
    return with_baselines


def format_bus_data(path_to_excel_file: str, sheet_name: str = "Ridership by Route"):
    # read data - new format doesn't need skiprows
    df = pd.read_excel(
        path_to_excel_file,
        sheet_name=sheet_name,
        keep_default_na=False,
        na_values=["N/A", "999999", "NULL"],
    )

    # Check if this is the new format (has WeekStartDay, Route, TotalRiders columns)
    if "WeekStartDay" in df.columns and "Route" in df.columns and "TotalRiders" in df.columns:
        # New format - data is already in the right structure
        df = df.rename(columns={"Route": "route", "WeekStartDay": "date", "TotalRiders": "riders"})
        # cast empty/NULL values to 0
        df = df.replace(to_replace=["", "NULL"], value=0)
        # change datetime to date
        df["date"] = pd.to_datetime(
            df["date"],
            infer_datetime_format=True,
        ).dt.date.astype(str)
    else:
        # Old format (Box files) - need to re-read with skiprows=2
        df = pd.read_excel(
            path_to_excel_file,
            sheet_name=sheet_name,
            skiprows=2,
            keep_default_na=False,
            na_values=["N/A", "999999", "NULL"],
        )
        # Old format - rename unnamed data and melt
        # For old format, we need to find the route column and date columns
        route_col = None
        for col in df.columns:
            col_str = str(col) if not isinstance(col, str) else col
            if col_str.lower() == "route" or "route" in col_str.lower():
                route_col = col
        if route_col:
            df = df.rename(columns={route_col: "route"})
            # cast empty/NULL values to 0
            df = df.replace(to_replace=["", "NULL"], value=0)
            # melt to get into long format
            df = pd.melt(df, id_vars=["route"], var_name="date", value_name="riders")
            # change datetime to date
            df["date"] = pd.to_datetime(
                df["date"],
                infer_datetime_format=True,
            ).dt.date.astype(str)
        else:
            raise ValueError(f"Could not find route column. Available columns: {list(df.columns)}")
    # ensure all values are numeric, NULL/invalid to 0
    df["riders"] = pd.to_numeric(df["riders"], errors="coerce").fillna(0)
    # get list of bus routes
    routelist = list(set(df["route"].tolist()))
    # create dict
    output = {}
    # write out each set of routes to dict
    for route in routelist:
        dftemp = df[df["route"] == route]
        dictdata = dftemp[["date", "riders"]].to_dict(orient="records")
        rewritten_route_id = unofficial_bus_labels_map.get(route) or route
        output[rewritten_route_id] = dictdata
    return output


def generate_ridership_json(source: RidershipSource):
    subway = format_subway_data(source.subway_ridership_csv_path)
    bus = format_bus_data(source.bus_ridership_xlsx_path, source.bus_sheet_name)
    cr = format_cr_data(
        source.cr_ridership_csv_path,
        source.cr_seasonal_ridership_csv_path,
    )
    return {**subway, **bus, **cr}


def get_ridership_json(source: RidershipSource):
    target_path = source.ridership_json_path
    if not path.exists(target_path):
        data_dict = generate_ridership_json(source)
        with open(target_path, "w") as file:
            file.write(json.dumps(data_dict))
    with open(target_path, "r") as file:
        return json.loads(file.read())
