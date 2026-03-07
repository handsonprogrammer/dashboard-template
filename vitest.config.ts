import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/tests/setup.ts"],
        include: ["src/**/*.{test,spec}.{ts,tsx}"],
        exclude: ["src/tests/e2e/**", "node_modules/**"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov", "html"],
            include: ["src/lib/**", "src/components/**"],
            exclude: ["src/tests/**", "**/*.stories.*"],
        },
    },
});
