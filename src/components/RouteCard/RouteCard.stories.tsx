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
    routeKind: "bus" as const,
    serviceFraction: 0.81,
    serviceRegimes: {
        covid: {
            weekday: {
                tripsPerHour: lowTph,
            },
        },
        baseline: {
            weekday: {
                tripsPerHour: highTph,
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
