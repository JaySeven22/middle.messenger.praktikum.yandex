import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist/"] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{js,ts}"],
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            "sort-vars": "error",
        },
    },
    {
        files: ["vite.config.ts"],
        languageOptions: {
            globals: { process: "readonly" },
        },
    },
);
