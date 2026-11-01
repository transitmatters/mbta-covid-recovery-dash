import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { summaryLineData } from "storydata/summaryLineData";

import TopLineMobile from "./TopLineMobile";

const meta = {
    title: "TopLineMobile",
    component: TopLineMobile,
} satisfies Meta<typeof TopLineMobile>;

export default meta;

export const Default: StoryObj<typeof meta> = {
    args: { summaryData: summaryLineData },
};
