// /** @type {import('jest').Config} */

console.log('El archivo de configuración de Jest se está cargando.');
console.log('directory', __dirname);

module.exports = {
  verbose: true,
  bail: true,
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  transform: {
    '\\.(css|less|scss|sass)$': '<rootDir>/___mocks___/css-mock.js',
    '^.+\\.jsx?$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: ['/node_modules/', '.*\\.css', '../.../.../node_modules/(?!(chalk)/)'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/___mocks___/css-mock.js',
    uuid: require.resolve('uuid'),
  },
};
