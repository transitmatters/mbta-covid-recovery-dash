import React from "react";
import { highTph, lowTph } from "storydata/tripsPerHour";

import { RouteData } from "types";

import RouteCard from "./RouteCard";

export default {
    title: "RouteCard",
    component: RouteCard,
};

const data77: RouteData = {
    title: "71",
    subtitle: "Watertown Square - Harvard Station",
    routeKind: "bus" as const,
    serviceFraction: 0.81,
    serviceRegimes: {
        covid: {
            weekday: {
                tripsPerHour: lowTph,
                totalTrips: 48,
                meanWaitTime: 17,
                crowdingFactor: 1.15,
            },
        },
        baseline: {
            weekday: {
                tripsPerHour: highTph,
                totalTrips: 66,
                meanWaitTime: 9,
            },
        },
    },
};

export const Default = () => {
    return (
        <>
            <RouteCard routeData={data77} />
            <RouteCard routeData={data77} />
            <RouteCard routeData={data77} />
            <RouteCard routeData={data77} />
        </>
    );
};
