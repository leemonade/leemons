const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { getRoleObject } = require('../../__fixtures__/getRoleObject');
const { registerRole } = require('./registerRole');
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

it('Should register the role correctly', async () => {
  // Arrange
  const { role, category } = getRoleObject();

  const actions = {
    'multilanguage.common.addManyByKey': fn(),
    'leebrary.categories.add': fn(),
  };

  const ctx = generateCtx({
    actions,
    models: {
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
    },

    caller: 'testing',
  });

  // Act
  const response = await registerRole({ ...role, ctx });

  // Assert
  expect(actions['multilanguage.common.addManyByKey']).nthCalledWith(1, {
    key: ctx.prefixPN(`roles.${role.name}.plural`),
    data: role.pluralName,
  });
  expect(actions['multilanguage.common.addManyByKey']).nthCalledWith(2, {
    key: ctx.prefixPN(`roles.${role.name}.singular`),
    data: role.singularName,
  });
  expect(actions['leebrary.categories.add']).toBeCalledWith(
    expect.objectContaining({
      ...category,
      role: `assignables.${role.name}`,
    })
  );
  expect(response).toBe(true);
});

it('Should throw if the role already exists', async () => {
  // Arrange
  const { role } = getRoleObject();

  const actions = {
    'multilanguage.common.addManyByKey': fn(),
    'leebrary.categories.add': fn(),
  };

  const ctx = generateCtx({
    actions,
    models: {
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
    },

    caller: 'testing',
  });

  await ctx.tx.db.Roles.create({
    name: role.name,
    plugin: ctx.callerPlugin,
  });

  // Act
  const testFn = () => registerRole({ ...role, ctx });

  // Assert
  return expect(testFn).rejects.toThrowError(`Role "${role.name}" already exists in assignables`);
});

it('Should throw if the required params are not provided', () => {
  // Arrange
  const { role } = getRoleObject();

  const ctx = generateCtx({
    actions: {
      'multilanguage.common.addManyByKey': () => {},
      'leebrary.categories.add': () => {},
    },
    models: {
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
    },

    caller: 'testing',
  });

  // Act
  const testFnWithoutRoleName = () => registerRole({ ...role, name: undefined, ctx });
  const testFnWithoutTeacherDetailUrl = () =>
    registerRole({ ...role, teacherDetailUrl: undefined, ctx });
  const testFnWithoutStudentDetailUrl = () =>
    registerRole({ ...role, studentDetailUrl: undefined, ctx });
  const testFnWithoutEvaluationDetailUrl = () =>
    registerRole({ ...role, evaluationDetailUrl: undefined, ctx });

  // Assert

  expect(testFnWithoutRoleName).rejects.toThrow(/must have required property 'name'/);
  expect(testFnWithoutTeacherDetailUrl).rejects.toThrow(
    /must have required property 'teacherDetailUrl'/
  );
  expect(testFnWithoutStudentDetailUrl).rejects.toThrow(
    /must have required property 'studentDetailUrl'/
  );
  expect(testFnWithoutEvaluationDetailUrl).rejects.toThrow(
    /must have required property 'evaluationDetailUrl'/
  );
});
