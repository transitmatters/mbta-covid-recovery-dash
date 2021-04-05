import React from "react";

import { lineDataOneBus } from "storydata/lineData";

import LineCard from "./LineCard";

export default {
    title: "LineCard",
    component: LineCard,
};

export const Default = () => {
    return (
        <>
            <LineCard lineData={lineDataOneBus} />
        </>
    );
};
