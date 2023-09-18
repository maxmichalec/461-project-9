// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Use Node.js environment for testing
  roots: ['<rootDir>/src'], // Specify the root directory of your TypeScript source files
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testTimeout: 1000000,
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/*.ts'], // Adjust the path to match your source files
  coverageReporters: ['text', 'text-summary', 'html'],
};  
