import React from "react";

import { createTestTimeSeries } from "storydata/timeSeries";
import { highTph, lowTph } from "storydata/tripsPerHour";
import { RouteData } from "types";

import RouteCard from "./RouteCard";

export default {
    title: "RouteCard",
    component: RouteCard,
};

const data77: RouteData = {
    title: "71",
    id: "route-71",
    subtitle: "Watertown Square - Harvard Station",
    routeKind: "bus" as const,
    serviceFraction: 0.81,
    ridershipHistory: createTestTimeSeries(),
    serviceHistory: createTestTimeSeries({ baseline: 60, amplitude: 30, period: 900 }),
    serviceRegimes: {
        covid: {
            weekday: {
                cancelled: false,
                tripsPerHour: lowTph,
                totalTrips: 48,
            },
        },
        baseline: {
            weekday: {
                cancelled: false,
                tripsPerHour: highTph,
                totalTrips: 66,
            },
        },
    },
};

export const Default = () => {
    return (
        <>
            <RouteCard routeData={data77} />
        </>
    );
};
