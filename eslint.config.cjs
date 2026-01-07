const js = require("@eslint/js");
const globals = require("globals");
const jsonc = require("eslint-plugin-jsonc");

module.exports = [
  { ignores: ["node_modules/**", "dist/**", "build/**"] },

  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: globals.browser
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error"
    }
  },

  {
    files: ["**/*.json"],
    plugins: { jsonc },
    languageOptions: { parser: jsonc.parsers.jsonc },
    rules: {
      ...jsonc.configs["recommended-with-json"].rules
    }
  }
];
