import React from "react";

import { summaryLineData } from "storydata/summaryLineData";

import TopLine from "./TopLine";

export default {
    title: "TopLine",
    component: TopLine,
};

export const Default = () => {
    return <TopLine summaryData={summaryLineData} />;
};
