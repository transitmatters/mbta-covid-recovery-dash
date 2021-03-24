export type Time = number;

export type RouteKind = "red" | "green" | "orange" | "blue" | "silver" | "regional-rail" | "bus";
export type ServiceDay = "weekday" | "saturday" | "sunday";
export type ServiceRegime = "baseline" | "current";

export type TripsPerHour = readonly number[] & { length: 24 };

export type TimeSeries<X = number, Y = number> = { x: X; y: Y }[];

export type ServiceLevels = {
    cancelled: boolean;
    tripsPerHour?: TripsPerHour;
    totalTrips: number;
};

export type RouteData = {
    id: string;
    title: string;
    startDate: string;
    subtitle?: string;
    ridershipHistory: number[];
    serviceHistory: number[];
    routeKind: RouteKind;
    serviceFraction: number;
    serviceRegimes: Record<ServiceRegime, Record<ServiceDay, ServiceLevels>>;
};
