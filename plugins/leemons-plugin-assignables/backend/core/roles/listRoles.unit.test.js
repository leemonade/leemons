// const { it, expect } = require('@jest/globals');
// const { generateCtx } = require('@leemons/testing');
// const { getExpectedRole } = require('../../__fixtures__/getExpectedRole');
// const { listRoles } = require('./listRoles');

// it('should return all the roles', async () => {
//   const roleNames = ['task', 'test', 'feedback'];
//   const roles = [getExpectedRole('task'), getExpectedRole('test'), getExpectedRole('feedback')];
//   const ctx = generateCtx({
//     models: {
//       Roles: {
//         find: () => ({ lean: () => roles }),
//       },
//     },
//   });

//   const response = await listRoles({ ctx });

//   expect(response).toEqual(roleNames);
// });

// it('should not throw if no role is registered', async () => {
//   const ctx = generateCtx({
//     models: {
//       Roles: {
//         find: () => ({ lean: () => [] }),
//       },
//     },
//   });

//   const response = await listRoles({ ctx });

//   expect(response).toEqual([]);
// });

const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { listRoles } = require('./listRoles');
const { rolesSchema } = require('../../models/roles');

let mongooseConnection;
let disconnectMongoose;

beforeAll(async () => {
  const { mongoose, disconnect } = await createMongooseConnection();

  mongooseConnection = mongoose;
  disconnectMongoose = disconnect;
});

afterAll(async () => {
  await disconnectMongoose();

  mongooseConnection = null;
  disconnectMongoose = null;
});

beforeEach(async () => {
  await mongooseConnection.dropDatabase();
});

it('Should return all the roles', async () => {
  const ctx = generateCtx({
    models: {
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
    },
  });

  const initialValues = [
    {
      name: 'role-1',
      plugin: 'leemons-testing',
    },
    {
      name: 'role-2',
      plugin: 'leemons-testing',
    },
    {
      name: 'role-3',
      plugin: 'leemons-testing',
    },
  ];
  await ctx.db.Roles.create(initialValues);
  const expectedValues = initialValues.map((value) => value.name);

  // Act
  const response = await listRoles({ ctx });

  // Assert
  expect(response).toEqual(expect.arrayContaining(expectedValues));
});

it('Should not throw if no role is found', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
    },
  });

  // Act
  const response = await listRoles({ ctx });

  // Assert
  expect(response).toEqual([]);
});
