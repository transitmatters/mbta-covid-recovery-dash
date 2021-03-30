import { RouteData } from "types";

const colorLines = ["red", "green", "blue", "orange", "silver"];
const keyBusRoutes = [1, 15, 22, 23, 28, 32, 39, 57, 66, 71, 73, 77, 111, 116, 117].map(String);

const kind = (r: RouteData) => {
    if (colorLines.includes(r.id.toLowerCase())) {
        return 0;
    } else if (keyBusRoutes.includes(r.id)) {
        return 1;
    } else if (r.id.startsWith("CR-")) {
        return 2;
    }
    return 3;
};

const isCancelled = (r: RouteData) => r.serviceRegimes.current.weekday.cancelled;

const lowestServiceFraction = (r: RouteData) => r.serviceFraction;
const highestServiceFraction = (r: RouteData) => -r.serviceFraction;

const lowestTotalTrips = (r: RouteData) => r.totalTrips;
const highestTotalTrips = (r: RouteData) => -r.totalTrips;

const highestRidershipFraction = (r: RouteData) => {
    const { ridershipHistory } = r;
    if (ridershipHistory && !isCancelled(r)) {
        return ridershipHistory[0] / ridershipHistory[ridershipHistory.length - 1];
    }
    return Infinity;
};

const lowestRidershipFraction = (r: RouteData) => {
    const { ridershipHistory } = r;
    if (ridershipHistory && !isCancelled(r)) {
        return -highestRidershipFraction(r);
    }
    return Infinity;
};

const lowestTotalRidership = (r: RouteData) => {
    const { ridershipHistory } = r;
    if (ridershipHistory && !isCancelled(r)) {
        return ridershipHistory[ridershipHistory.length - 1];
    }
    return Infinity;
};

const highestTotalRidership = (r: RouteData) => {
    const { ridershipHistory } = r;
    if (ridershipHistory && !isCancelled(r)) {
        return -lowestTotalRidership(r);
    }
    return Infinity;
};

export const sortFunctions = {
    kind,
    lowestServiceFraction,
    highestServiceFraction,
    lowestTotalTrips,
    highestTotalTrips,
    lowestRidershipFraction,
    highestRidershipFraction,
    lowestTotalRidership,
    highestTotalRidership,
};

export type SortFn = (r: RouteData) => number;
export type Sort = keyof typeof sortFunctions;
