const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const isWatch = process.argv.includes("--watch");

// TypeScript 설정
const tsConfig = {
    compilerOptions: {
        target: "ES2018",
        lib: ["DOM", "DOM.Iterable", "ES6"],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: "ESNext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: false,
        declaration: true,
        declarationMap: true,
        outDir: "./dist",
        jsx: "react-jsx",
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist", "example"],
};

// tsconfig.json 생성
fs.writeFileSync(
    path.join(__dirname, "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2)
);

const commonConfig = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    minify: true,
    sourcemap: true,
    external: ["react", "@ehfuse/forma"],
    target: ["es2018"],
    tsconfig: "tsconfig.json",
};

async function build() {
    try {
        // dist 폴더 생성
        if (!fs.existsSync("dist")) {
            fs.mkdirSync("dist");
        }

        console.log("🚀 Building library...");

        // CommonJS build
        await esbuild.build({
            ...commonConfig,
            format: "cjs",
            outfile: "dist/index.js",
            platform: "node",
        });

        // ESM build
        await esbuild.build({
            ...commonConfig,
            format: "esm",
            outfile: "dist/index.esm.js",
            platform: "neutral",
        });

        // TypeScript 타입 정의 파일 생성
        const { execSync } = require("child_process");
        try {
            execSync(
                "npx tsc --declaration --emitDeclarationOnly --outDir dist",
                { stdio: "inherit" }
            );
        } catch (error) {
            console.warn(
                "TypeScript declaration generation failed, creating manual d.ts file..."
            );

            // 수동으로 타입 정의 파일 생성
            const dtsContent = `import { useEffect, useCallback } from "react";

interface KeyboardState {
    capsLock: boolean;
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
    pressedKeys: Set<string>;
    lastPressedKey: string | null;
}

type KeyComboCallback = () => void;
type KeyPressCallback = (key: string) => void;

interface KeyCombo {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    key: string;
}

export interface UseKeyboardStateReturn {
    capsLock: boolean;
    shift: boolean;
    ctrl: boolean;
    alt: boolean;
    meta: boolean;
    pressedKeys: Set<string>;
    lastPressedKey: string | null;
    isShiftPressed: boolean;
    isCtrlPressed: boolean;
    isAltPressed: boolean;
    isMetaPressed: boolean;
    isCapsLockOn: boolean;
    isCtrlOrMeta: boolean;
    registerKeyCombo: (combo: KeyCombo, callback: KeyComboCallback) => () => void;
    watchKey: (key: string, callback: KeyPressCallback) => () => void;
    isKeyPressed: (key: string) => boolean;
    areKeysPressed: (keys: string[]) => boolean;
}

export declare function useKeyboardState(): UseKeyboardStateReturn;
export declare function resetKeyboardState(): void;
`;

            fs.writeFileSync("dist/index.d.ts", dtsContent);
        }

        // package.json에서 버전 정보 복사
        const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
        console.log(`✅ Build completed successfully! v${packageJson.version}`);
        console.log("📦 Generated files:");
        console.log("  - dist/index.js (CommonJS)");
        console.log("  - dist/index.esm.js (ESM)");
        console.log("  - dist/index.d.ts (TypeScript definitions)");
    } catch (error) {
        console.error("❌ Build failed:", error);
        process.exit(1);
    }
}

if (isWatch) {
    console.log("👀 Watching for changes...");

    const watchConfig = {
        ...commonConfig,
        watch: {
            onRebuild(error, result) {
                if (error) {
                    console.error("❌ Watch build failed:", error);
                } else {
                    console.log("✅ Rebuilt successfully");
                }
            },
        },
    };

    // Watch mode for both builds
    esbuild.build({
        ...watchConfig,
        format: "cjs",
        outfile: "dist/index.js",
        platform: "node",
    });

    esbuild.build({
        ...watchConfig,
        format: "esm",
        outfile: "dist/index.esm.js",
        platform: "neutral",
    });
} else {
    build();
}
