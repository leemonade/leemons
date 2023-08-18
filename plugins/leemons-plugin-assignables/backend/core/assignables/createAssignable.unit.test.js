const { it, expect } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');
const { createAssignable } = require('./createAssignable');
const getAssignableObject = require('../../__fixtures__/getAssignableObject');

it('should not throw', () => {
  const assignable = getAssignableObject();
  const uuid = '550e8400-e29b-41d4-a716-446655440000';
  const ctx = generateCtx({
    actions: {
      'assignables.roles.get': ({ role }) => {
        if (role !== assignable.role) {
          throw new Error('Role not found');
        }
      },
      'common.versions.register': () => ({
        uuid,
        currentPublished: null,
        fullId: `${uuid}@1.0.0`,
      }),
      'leebrary.assets.add': () => ({
        id: `${uuid}@1.0.0`,
      }),
      'leebrary.assets.duplicate': ({ id }) => ({ id }),
      'leebrary.assets.update': ({ asset }) => ({ id: asset.id }),
    },
    models: {
      Assignables: {
        create: () => ({}),
      },
    },
  });

  const testFn = async () => createAssignable({ assignable, ctx });

  // return expect(testFn()).resolves.toBe(`${uuid}@1.0.0`);
  return expect(testFn()).resolves.toBeDefined();
});
