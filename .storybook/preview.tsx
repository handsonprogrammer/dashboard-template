import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            default: "light",
            values: [
                { name: "light", value: "#ffffff" },
                { name: "dark", value: "#0a0a0a" },
            ],
        },
        nextjs: {
            appDirectory: true,
        },
    },
    // Apply dark class to <html> for dark-mode stories
    decorators: [
        (Story, context) => {
            const background = context.globals.backgrounds?.value;
            if (background === "#0a0a0a") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return <Story />;
        },
    ],
};

export default preview;
