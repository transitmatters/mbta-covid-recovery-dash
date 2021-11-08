import React from "react";

import { summaryLineData } from "storydata/summaryLineData";

import TopLineMobile from "./TopLineMobile";

export default {
    title: "TopLineMobile",
    component: TopLineMobile,
};

export const Default = () => {
    return <TopLineMobile summaryData={summaryLineData} />;
};
