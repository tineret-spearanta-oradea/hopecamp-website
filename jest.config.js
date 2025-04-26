/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // This helps Jest resolve module paths like '@/lib/...'
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // A list of paths to modules that run some code to configure or set up the testing framework before each test file in the suite is executed
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Load environment variables before tests run
  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.integration.test.[jt]s?(x)", // Look for integration tests specifically
    // You might want to add unit tests later:
    // "**/__tests__/**/*.test.[jt]s?(x)",
    // "**/?(*.)+(spec|test).[tj]s?(x)"
  ],
  // Increase timeout for integration tests which might take longer
  testTimeout: 30000, // 30 seconds
};
