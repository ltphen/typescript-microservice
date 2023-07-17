module.exports = {
    rootDir: __dirname,
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: false,
  testMatch: ['**/*.test.ts'],
    collectCoverageFrom: ['src/**/*.ts'],
  };