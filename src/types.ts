export type Time = number;

export type RouteKind = "red" | "green" | "orange" | "blue" | "silver" | "regional-rail" | "bus";
export type ServiceDay = "weekday" | "weekend";
export type ServiceRegime = "baseline" | "covid";

export type TripsPerHour = readonly number[] & { length: 24 };

export type TimeSeries<X = number, Y = number> = { x: X; y: Y }[];

export type ServiceLevels = {
    cancelled?: boolean;
    tripsPerHour: TripsPerHour;
    meanWaitTime: number;
    totalTrips: number;
    crowdingFactor?: number;
};

export type RouteData = {
    title: string;
    subtitle?: string;
    ridership: TimeSeries<string>;
    service: TimeSeries<string>;
    routeKind: RouteKind;
    serviceFraction: number;
    serviceRegimes: Record<ServiceRegime, Record<ServiceDay, ServiceLevels>>;
};
