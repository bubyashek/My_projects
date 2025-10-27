export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['server.js', 'src/**/*.js'],
  coverageDirectory: 'coverage',
  verbose: true,
  setupFilesAfterEnv: [],
  testTimeout: 10000
};

