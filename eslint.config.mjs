import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

// Front end plugins/configs
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginQuery from "@tanstack/eslint-plugin-query";

const rootConfig = defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  tseslint.configs.recommended,
]);

const frontendConfig = defineConfig([
  { ignores: ["dist"] },
  {
    // Only applies to files in frontend/ folder
    files: ["frontend/**/*.{ts,tsx}"],
    ignores: ["src/vite-env.d.ts", "vite.config.ts"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      jsxA11y.flatConfigs.recommended,
      pluginQuery.configs["flat/recommended"],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // Vite rules
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
]);

// Keep eslintConfigPrettier last (prevents eslint rules from interfering with Prettier rules)
export default tseslint.config(
  rootConfig,
  frontendConfig,
  eslintConfigPrettier,
);
