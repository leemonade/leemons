const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { unregisterRole } = require('./unregisterRole');
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

it('Should return true if role exists', async () => {
  // Arrange
  const roleName = 'testing-role';

  const ctx = generateCtx({
    models: {
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
    },
  });

  const initialValues = [
    {
      name: roleName,
      plugin: 'leemons-testing',
    },
  ];
  await ctx.db.Roles.create(initialValues);

  // Act
  const response = await unregisterRole({ role: roleName, ctx });
  const rolesAfterDeleting = await ctx.db.Roles.findOne({ name: roleName }).lean();

  // Assert
  expect(response).toBe(true);
  expect(rolesAfterDeleting).toBeNull();
});

it('Should return false if role does not exists', async () => {
  // Arrange
  const roleName = 'testing-role';

  const ctx = generateCtx({
    models: {
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
    },
  });

  // Act
  const response = await unregisterRole({ role: roleName, ctx });

  // Assert
  expect(response).toBe(false);
});

it('Should only delete the specified role', async () => {
  // Arrange
  const roleName = 'testing-role';

  const ctx = generateCtx({
    models: {
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
    },
  });

  const initialValues = [
    {
      name: roleName,
      plugin: 'leemons-testing',
    },
    {
      name: 'other-role',
      plugin: 'leemons-testing',
    },
  ];
  await ctx.db.Roles.create(initialValues);

  // Act
  const response = await unregisterRole({ role: roleName, ctx });
  const rolesAfterDeleting = await ctx.db.Roles.find({ name: 'other-role' }).lean();

  // Assert
  expect(response).toBe(true);
  expect(rolesAfterDeleting).not.toBeNull();
});

it('Should throw if no role is provided', () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
    },
  });

  // Act
  const testFn = () => unregisterRole({ ctx });

  // Assert
  expect(testFn).rejects.toThrowError('Role param is required');
});
