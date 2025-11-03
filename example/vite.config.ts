import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@ehfuse/keyboard-state": path.resolve(
                __dirname,
                "../src/index.ts"
            ),
            // React 중복 인스턴스 방지
            react: path.resolve(__dirname, "./node_modules/react"),
            "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
            "@ehfuse/forma": path.resolve(
                __dirname,
                "./node_modules/@ehfuse/forma"
            ),
        },
        dedupe: ["react", "react-dom", "@ehfuse/forma"],
    },
});
