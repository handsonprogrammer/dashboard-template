import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
    stories: ["../src/**/*.stories.@(ts|tsx)", "../src/**/*.mdx"],
    addons: [
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
    ],
    framework: {
        name: "@storybook/nextjs",
        options: {},
    },
    staticDirs: ["../public"],
    docs: {
        autodocs: "tag",
    },
};

export default config;
