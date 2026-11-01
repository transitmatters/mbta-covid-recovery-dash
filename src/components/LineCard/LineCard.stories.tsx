import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { lineDataOneBus } from "storydata/lineData";

import LineCard from "./LineCard";

const meta = {
    title: "LineCard",
    component: LineCard,
} satisfies Meta<typeof LineCard>;

export default meta;

export const Default: StoryObj<typeof meta> = {
    args: { lineData: lineDataOneBus },
};
