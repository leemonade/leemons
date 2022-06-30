const path = require('path');
const { env, generateEnv } = require('../lib/env');

describe('Environment Functions', () => {
  beforeAll(() => {
    process.env = {
      existing: 'Exists',
    };
  });

  describe('Call env', () => {
    test('with no params', () => {
      expect(env()).toBeUndefined();
    });

    test('with undefined key, null as defaultValue', () => {
      expect(env(undefined, null)).toBeNull();
    });

    test('with non-existing key', () => {
      expect(env('nonExisting')).toBeUndefined();
    });

    test('with non-existing key, false as defaultKey', () => {
      expect(env('nonExisting', false)).toBe(false);
    });

    test('with existing key', () => {
      expect(env('existing')).toBe(process.env.existing);
    });

    test('with existing key, false as defaultKey', () => {
      expect(env('existing', false)).toBe(process.env.existing);
    });
  });

  describe('Call generateEnv', () => {
    test('with no filename', async () => {
      const data = await generateEnv();
      expect(data).toEqual({});
    });

    test('with non existing filename', async () => {
      const data = await generateEnv('./files/nonExistingDotenv');
      expect(data).toEqual({});
    });

    test('with existing filename (absolute path)', async () => {
      const data = await generateEnv(path.join(__dirname, '/files/dotenv'));
      expect(data).toEqual({
        LOADED: 'true',
        TYPE: 'DOT ENV',
      });
    });

    test('with existing filename (relative path from cwd)', async () => {
      const data = await generateEnv(
        path.relative(process.cwd(), path.join(__dirname, '/files/dotenv'))
      );
      expect(data).toEqual({
        LOADED: 'true',
        TYPE: 'DOT ENV',
      });
    });
  });
});
