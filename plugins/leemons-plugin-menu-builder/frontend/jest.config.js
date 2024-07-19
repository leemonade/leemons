const mockCSSRoute = '<rootDir>/___mocks___/css-mock.js';

/** @type {import('jest').Config} */
module.exports = {
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
