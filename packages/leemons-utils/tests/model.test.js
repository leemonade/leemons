const { generateModelName, getModel } = require('../lib/model');

describe('Model Functions', () => {
  describe('call getModel', () => {
    beforeAll(() => {
      global.leemons = {
        plugins: {
          'user-admin': {
            models: {
              'plugins_user-admin::users': {
                exists: true,
              },
            },
          },
        },
      };
    });

    test('with no params', () => {
      expect(getModel()).toBeNull();
    });

    test('with no-string path', () => {
      expect(getModel(1234)).toBeNull();
      expect(getModel(['123'])).toBeNull();
    });

    test('with no-array model object', () => {
      expect(() => getModel('1234', 'models')).toThrow();
    });

    test('with non-existing model name', () => {
      expect(getModel('leemons::nonExistingModel')).toBeNull();
    });

    test('with existing model name in leemons', () => {
      expect(getModel('plugins_user-admin::users')).toEqual(
        global.leemons.plugins['user-admin'].models['plugins_user-admin::users']
      );
    });

    test('with non existing model name in given object', () => {
      const object = [];

      expect(getModel('plugins_user-admin::users', object)).toBeNull();
    });

    test('with existing model name in given object', () => {
      const object = [
        {
          modelName: 'test::message',
          found: true,
        },
      ];

      expect(getModel('test::message', object)).toEqual(object[0]);
    });
  });

  describe('call generateModelName', () => {
    test('with empty params', () => {
      expect(() => generateModelName()).toThrow();
    });

    test('with no target', () => {
      expect(() => generateModelName(undefined, 'modelName')).toThrow();
    });

    test('with no modelName', () => {
      expect(() => generateModelName('target', undefined)).toThrow();
    });

    test('with empty string target', () => {
      expect(() => generateModelName('', 'modelName')).toThrow();
    });

    test('with empty string modelName', () => {
      expect(() => generateModelName('target', '')).toThrow();
    });

    test('with valid target and modelName', () => {
      expect(generateModelName('target', 'modelName')).toBe('target::modelName');
    });

    test('with valid target (2 depth levels) and modelName', () => {
      expect(generateModelName('plugins.example', 'modelName')).toBe('plugins_example::modelName');
    });

    test('with valid target (2 depth levels) and modelName', () => {
      expect(generateModelName('plugins.example', 'modelName')).toBe('plugins_example::modelName');
    });

    test('with valid target (5 depth levels) and modelName', () => {
      expect(generateModelName('1.2.3.4.5', 'modelName')).toBe('1_2_3_4_5::modelName');
    });
  });
});
