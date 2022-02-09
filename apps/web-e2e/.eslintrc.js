module.exports = {
  ...require("config/eslint-cypress.js"),
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // Required for certain syntax usages
    ecmaVersion: 2021,
  },
};
