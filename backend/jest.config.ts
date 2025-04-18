/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  globalTeardown: "./src/jestGlobalTeardown.ts",
  globalSetup: "./src/jestGlobalSetup.ts",
};
