import React from "react";

import { routeDataOneBus } from "storydata/routeData";

import RouteCard from "./RouteCard";

export default {
    title: "RouteCard",
    component: RouteCard,
};

export const Default = () => {
    return (
        <>
            <RouteCard routeData={routeDataOneBus} />
        </>
    );
};
