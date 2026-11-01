import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { summaryLineData } from "storydata/summaryLineData";

import TopLineChart from "./TopLineChart";

const label_array = ["pre-covid"];
for (let i = 1; i < summaryLineData["totalRidershipHistory"].length - 1; ++i) {
    label_array.push("");
}
label_array.push("current");

const pie = {
    labels: ["pre-covid", "current"],
    datasets: [
        {
            data: summaryLineData["totalRidershipPercentage"],
        },
    ],
};

const line = {
    labels: label_array,
    datasets: [
        {
            data: summaryLineData["totalRidershipHistory"],
            fill: false,
            tension: 0,
        },
    ],
};

const meta = {
    title: "TopLine Chart",
    component: TopLineChart,
} satisfies Meta<typeof TopLineChart>;

export default meta;

export const Default: StoryObj<typeof meta> = {
    args: { sparklineData: line, pieData: pie, label: "ridership" },
};
