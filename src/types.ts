export type Time = number;

export type RouteKind = "red" | "green" | "orange" | "blue" | "silver" | "regional-rail" | "bus";

export type ServiceDay = "weekday" | "saturday" | "sunday";
export type ServiceRegime = "baseline" | "current";

export type TripsPerHour = readonly number[] & { length: 24 };

export type ServiceLevels = {
    cancelled: boolean;
    tripsPerHour?: TripsPerHour;
    totalTrips: number;
};

export type RouteData = {
    id: string;
    startDate: string;
    totalTrips: number;
    serviceFraction: number;
    ridershipHistory: null | number[];
    serviceHistory: number[];
    routeKind: RouteKind;
    serviceRegimes: Record<ServiceRegime, Record<ServiceDay, ServiceLevels>>;
};
