module.exports = {
  // Default value
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",

  // Added for coverage
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,ts,vue}",
    "!src/**/*.component.ts",
    "!src/main.ts",
    "!src/routes.ts",
    "!**/*.d.ts"
  ],
  coverageReporters: ["html", "json-summary", "text-summary", "lcov", "clover"]

  // Added for managing canvas inside components.
  // setupFiles: ["jest-canvas-mock", "<rootDir>/setup_file.js"]
};
