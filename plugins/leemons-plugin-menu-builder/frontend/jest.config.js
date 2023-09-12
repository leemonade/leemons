// /** @type {import('jest').Config} */

module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['./src/**/*.{js,jsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/'],
};
