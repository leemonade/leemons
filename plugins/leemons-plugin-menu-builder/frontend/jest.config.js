/** @type {import('jest').Config} */

console.log('El archivo de configuración de Jest se está cargando.');
console.log('directory', __dirname);

module.exports = {
  rootDir: __dirname,
  collectCoverage: false,
  collectCoverageFrom: ['./src/**/*.{js,jsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // transform: {
  //   '^.+\\.js?$': 'babel-jest',
  // },
  transformIgnorePatterns: ['/node_modules/', '/bubbles/'],
  moduleNameMapper: {
    '^@bubbles-ui/components$': '<rootDir>/../../../node_modules/@bubbles-ui/components',
  },
};
