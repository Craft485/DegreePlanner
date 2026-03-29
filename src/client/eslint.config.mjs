import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-console": ["warn", { allow: ["error", "warn", "debug"] }],
      "comma-dangle": ["warn", "always-multiline"],
      "no-duplicate-imports": "error",
      "no-unused-vars": ["error", {
        "vars": "all",
        "args": "all",
        "argsIgnorePattern": "^_",
        "destructuredArrayIgnorePattern": "^_",
        "ignoreRestSiblings": true,
      }],
    },
  },
]);

export default eslintConfig;
