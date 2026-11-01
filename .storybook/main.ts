import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.tsx"],
    framework: "@storybook/nextjs-vite",
    staticDirs: ["../public"],
};

export default config;
