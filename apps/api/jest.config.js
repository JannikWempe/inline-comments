module.exports = {
  "testMatch": [
    "<rootDir>/src/**/__tests__/**/*.ts?(x)",
    "<rootDir>/src/**/?(*.)+(spec|test).ts?(x)"
  ],
  "clearMocks": true,
  "testPathIgnorePatterns": [
    "/node_modules/"
  ],
  "watchPathIgnorePatterns": [
    "/node_modules/"
  ],
  "preset": "ts-jest",
  "globals": {
    "ts-jest": {
      "tsconfig": "tsconfig.dev.json"
    }
  }
};
