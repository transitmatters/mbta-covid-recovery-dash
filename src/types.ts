export type Time = number;

export type LineKind =
    | "red"
    | "green"
    | "orange"
    | "blue"
    | "silver"
    | "regional-rail"
    | "bus"
    | "boat";

export type ServiceDay = "weekday" | "saturday" | "sunday";
export type ServiceRegime = "baseline" | "current";

export type TripsPerHour = readonly number[] & { length: 24 };

export type ServiceLevels = {
    cancelled: boolean;
    tripsPerHour?: TripsPerHour;
    totalTrips: number;
};

export type LineData = {
    id: string;
    shortName: string;
    longName: string;
    startDate: string;
    totalTrips: number;
    serviceFraction: number;
    routeIds: string[];
    ridershipHistory: null | number[];
    serviceHistory: number[];
    lineKind: LineKind;
    serviceRegimes: Record<ServiceRegime, Record<ServiceDay, ServiceLevels>>;
};
