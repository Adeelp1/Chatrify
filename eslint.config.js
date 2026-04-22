import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      ".env",
      "uploads/",
      "**/*.log",
      "*.config.js",
      "test/",
      "venv/",
    ],
  },
  js.configs.recommended,
  {
    files: ["Backend/server/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node
    },
    plugins: {
      import: importPlugin
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "import/no-commonjs": "error",
      "import/no-unresolved": "error",
    }
  },
]);
