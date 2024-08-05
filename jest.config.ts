import { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  projects: [
    // '<rootDir>/packages/*/jest.config.js',
    '<rootDir>/plugins/*/*/jest.config.js',
    // '<rootDir>/private-plugins/*/*/jest.config.js',
    '<rootDir>/private-plugins/*/*/jest.config.ts',
  ],
};

export default jestConfig;
