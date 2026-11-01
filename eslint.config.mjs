import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import react from "eslint-plugin-react";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default defineConfig([
    globalIgnores([".next/", "out/", "docs/", "storybook-static/", "next-env.d.ts"]),
    js.configs.recommended,
    react.configs.flat.recommended,
    ...nextVitals,
    ...nextTs,
    prettierRecommended,
    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node },
        },
        rules: {
            "import/no-anonymous-default-export": 0,
            "react/display-name": 0,
            "react/react-in-jsx-scope": 0,
            "react/no-unescaped-entities": 0,
            "react-hooks/exhaustive-deps": 0,
            "@typescript-eslint/no-empty-function": 0,
            "@typescript-eslint/no-empty-interface": 0,
            "@typescript-eslint/no-explicit-any": 0,
            "@typescript-eslint/no-inferrable-types": 0,
            "@typescript-eslint/no-non-null-assertion": 0,
            "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_+$" }],
            "@typescript-eslint/no-use-before-define": 0,
            "@typescript-eslint/explicit-module-boundary-types": 0,
            "no-constant-condition": 0,
        },
    },
]);
