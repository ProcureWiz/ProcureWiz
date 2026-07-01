import eslintPlugin from "eslint-plugin";

export default {
  root: true,
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: "module",
  },
  env: {
    browser: true,
    node: true,
    es2024: true,
  },
  extends: ["eslint:recommended"],
  rules: {
    "no-console": "warn",
    "prefer-const": "error",
  },
};
