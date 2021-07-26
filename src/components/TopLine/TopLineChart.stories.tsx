import React from "react";

import { summaryLineData } from "storydata/summaryLineData";

import TopLineChart from "./TopLineChart";

// var chartData= {
//     labels: ["pre-covid", "", "", "", "", "", "", "", "", "", "", "current"],
//     datasets: [{
//         data: [858333, 858333, 858333, 858333, 858333, 858333, 858333, 795767, 795767, 795767, 795767, 795767,],
//         fill: false,
//         tension: 0,
//     }],
// }
let label_array = ["pre-covid"];
for (let i = 1; i < summaryLineData["totalRidershipHistory"].length - 1; ++i) {
    label_array.push("");
}
label_array.push("current");

var pie={
    labels: ["pre-covid", "current"],
    datasets: [{
        data: summaryLineData["totalRidershipPercentage"]
    }],
}

var line={
    labels: label_array,
        datasets: [{
            data: summaryLineData["totalRidershipHistory"],
            fill: false,
            tension: 0,
        }],
}

export default {
    title: "TopLine Chart",
    component: TopLineChart,
};

export const Default = () => {
    return <TopLineChart sparklineData={line} pieData={pie} />;
}