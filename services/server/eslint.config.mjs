import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
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
])

export default eslintConfig;
