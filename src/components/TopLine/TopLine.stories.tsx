import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { summaryLineData } from "storydata/summaryLineData";

import TopLine from "./TopLine";

const meta = {
    title: "TopLine",
    component: TopLine,
} satisfies Meta<typeof TopLine>;

export default meta;

export const Default: StoryObj<typeof meta> = {
    args: { summaryData: summaryLineData },
};
