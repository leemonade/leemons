// /** @type {import('jest').Config} */

const mockCSSRoute = '<rootDir>/___mocks___/css-mock.js';

module.exports = {
  // 'ts-jest': {
  //   useESM: true,
  // },
  rootDir: __dirname,
  verbose: true,
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  transform: {
    '\\.(css|less|scss|sass)$': mockCSSRoute,
    '^.+\\.js?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: ['/node_modules/(?!swiper|ssr-window|dom7)'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': mockCSSRoute,
    uuid: require.resolve('uuid'),
  },
};
