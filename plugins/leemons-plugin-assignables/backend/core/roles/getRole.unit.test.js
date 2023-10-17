const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getRole } = require('./getRole');
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

it('Should return the requested role', async () => {
  // Arrange
  const roleName = 'testing-role';
  const ctx = generateCtx({
    models: {
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
    },
  });

  const existingRoles = [
    {
      name: roleName,
      plugin: 'leemons-testing',
    },
    {
      name: 'other-role-name',
      plugin: 'leemons-testing',
    },
  ];
  await ctx.db.Roles.create(existingRoles);
  const expectedValue = await ctx.db.Roles.findOne({ name: roleName }).lean();

  // Act
  const response = await getRole({ role: roleName, ctx });

  // Assert
  expect(response).toEqual(expectedValue);
});

it('Should throw if not role is given', async () => {
  // Arrange
  const expectedError = 'Role param is required';
  const ctx = generateCtx({});
  // Act
  const testFn = () => getRole({ ctx });

  // Assert
  expect(testFn).rejects.toThrowError(expectedError);
});

it('Should throw if the given role is not found', () => {
  // Arrange
  const roleName = 'testing-role';
  const ctx = generateCtx({
    models: {
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
    },
  });

  // Act
  const testFn = () => getRole({ role: roleName, ctx });

  // Assert
  return expect(testFn).rejects.toThrowError('Role not found');
});
