const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest: globalJest,
  describe,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { pick, omit } = require('lodash');

globalJest.mock('../../permissions/assignables/users/getUserPermissions');
globalJest.mock('../../roles');
globalJest.mock('../../subjects');
globalJest.mock('../../leebrary/assets');

const { getAssignables } = require('./getAssignables');
const { assignablesSchema } = require('../../../models/assignables');
const { getAssignableObject } = require('../../../__fixtures__/getAssignableObject');

const { getRoles } = require('../../roles');
const { getSubjects } = require('../../subjects');
const { getAsset } = require('../../leebrary/assets');
const { getUserPermissions } = require('../../permissions/assignables/users/getUserPermissions');

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

/**
 *
 * @param {Object} params
 * @param {Object} params.assignable
 * @param {string[]} params.assetIds
 * @param {Object} params.mock
 * @param {boolean} params.mock.getUserPermissions
 * @param {boolean} params.mock.getRoles
 * @param {boolean} params.mock.getSubjects
 * @param {boolean} params.mock.getAsset
 */
function getActions({ assignable, assetIds, mock }) {
  const roleDetails = {
    [assignable.role]: {
      role: assignable.role,
      detail: 'This object defined the role properties',
    },
  };
  const subjects = {
    [assignable.id]: assignable.subjects,
  };
  const assets = Object.fromEntries(
    assetIds.map((id) => [
      id,
      {
        id,
        name: id,
        detail: 'This is the asset detail object',
      },
    ])
  );

  const actions = {
    'common.versionControl.getVersion': ({ id }) =>
      id.map((eachId) => ({
        uuid: eachId,
        version: '1.0.0',
        fullId: eachId,
        published: false,
      })),
  };

  if (mock.getAsset) {
    getAsset.mockImplementation(({ id: assetsIds }) =>
      Object.values(pick(assets, Array.isArray(assetsIds) ? assetsIds : [assetsIds]))
    );
  }
  if (mock.getRoles) {
    getRoles.mockImplementation(({ roles }) => pick(roleDetails, roles));
  }
  if (mock.getSubjects) {
    getSubjects.mockImplementation(({ assignableIds }) => pick(subjects, assignableIds));
  }
  if (mock.getUserPermissions) {
    getUserPermissions.mockImplementation(({ assignables }) =>
      Object.fromEntries(
        assignables.map(({ id: assignableId }) => [assignableId, { actions: ['view'] }])
      )
    );
  }

  return {
    roleDetails,
    subjects,
    assets,

    actions,
  };
}

describe('Intended execution', () => {
  it('Returns the requested assignable', async () => {
    // Arrange
    const assignable = getAssignableObject();
    const id = 'assignable-id@1.0.0';
    const assetId = 'asset-id';

    const { actions, assets, roleDetails } = getActions({
      assignable,
      assetIds: [assetId],
      mock: {
        getAsset: true,
        getRoles: true,
        getSubjects: true,
        getUserPermissions: true,
      },
    });

    const expectedValue = {
      id,
      ...omit(assignable, ['subjects', 'asset']),
      roleDetails: roleDetails[assignable.role],
      asset: assets[assetId],
    };

    const ctx = generateCtx({
      actions,
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    const initialValue = {
      id,
      ...pick(assignable, [
        'role',
        'gradable',
        'center',
        'statement',
        'development',
        'duration',
        'submission',
        'resources',
        'metadata',
      ]),
      asset: 'asset-id',
    };
    await ctx.db.Assignables.create(initialValue);

    // Act
    const response = await getAssignables({ ids: [initialValue.id], ctx });

    // Assert
    expect(response).toEqual([expect.objectContaining(expectedValue)]);
  });

  it('Returns all the requested assignables', async () => {
    // Arrange
    const assignable = getAssignableObject();
    const firstId = 'assignable-id@1.0.0';
    const secondId = 'assignable-id@2.0.0';
    const assetId = 'asset-id';

    const { actions, assets, roleDetails } = getActions({
      assignable,
      assetIds: [assetId],
      mock: {
        getAsset: true,
        getRoles: true,
        getSubjects: true,
        getUserPermissions: true,
      },
    });

    const expectedValues = [
      {
        id: firstId,
        ...omit(assignable, ['subjects', 'asset']),
        roleDetails: roleDetails[assignable.role],
        asset: assets[assetId],
      },
      {
        id: secondId,
        ...omit(assignable, ['subjects', 'asset']),
        roleDetails: roleDetails[assignable.role],
        asset: assets[assetId],
      },
    ];

    const ctx = generateCtx({
      actions,
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    const initialValues = [
      {
        id: firstId,
        ...pick(assignable, [
          'role',
          'gradable',
          'center',
          'statement',
          'development',
          'duration',
          'submission',
          'resources',
          'metadata',
        ]),
        asset: 'asset-id',
      },
      {
        id: secondId,
        ...pick(assignable, [
          'role',
          'gradable',
          'center',
          'statement',
          'development',
          'duration',
          'submission',
          'resources',
          'metadata',
        ]),
        asset: 'asset-id',
      },
    ];
    await ctx.db.Assignables.insertMany(initialValues);

    // Act
    const response = await getAssignables({ ids: [firstId, secondId], ctx });

    // Assert
    expect(response).toEqual(
      expect.arrayContaining(
        expectedValues.map((expectedValue) => expect.objectContaining(expectedValue))
      )
    );
  });

  it('Returns the asset id if the asset field is omitted', async () => {
    // Arrange
    const assignable = getAssignableObject();
    const id = 'assignable-id@1.0.0';
    const assetId = 'asset-id';

    const { actions } = getActions({
      assignable,
      assetIds: [assetId],

      mock: {
        getAsset: true,
        getRoles: true,
        getSubjects: true,
        getUserPermissions: true,
      },
    });

    const ctx = generateCtx({
      actions,
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    const initialValue = {
      id,
      ...pick(assignable, [
        'role',
        'gradable',
        'center',
        'statement',
        'development',
        'duration',
        'submission',
        'resources',
        'metadata',
      ]),
      asset: 'asset-id',
    };
    await ctx.db.Assignables.create(initialValue);

    // Act
    const response = await getAssignables({
      ids: [initialValue.id],
      columns: [],
      ctx,
    });

    // Assert
    expect(response[0].asset).toBe(assetId);
  });
});

describe('Throw on missing property', () => {
  it('Throws an error when not found', async () => {
    // Arrange
    const id = 'assignable-id@1.0.0';

    const { actions } = getActions({
      assignable: {},
      assetIds: [],
      mock: {
        getAsset: true,
        getRoles: true,
        getSubjects: true,
        getUserPermissions: true,
      },
    });

    const ctx = generateCtx({
      actions,
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    // Act
    const testFn = () => getAssignables({ ids: [id], ctx });

    // Assert
    await expect(testFn()).rejects.toThrowError(
      "You don't have permissions to see some of the requested assignables or they do not exist"
    );
  });

  it('Throws an error if user lacks permissions', async () => {
    // Arrange
    const assignable = getAssignableObject();
    const firstId = 'assignable-id@1.0.0';
    const secondId = 'assignable-id@2.0.0';
    const assetId = 'asset-id';

    const { actions } = getActions({
      assignable,
      assetIds: [assetId],

      mock: {
        getAsset: true,
        getRoles: true,
        getSubjects: true,
        getUserPermissions: false,
      },
    });

    const ctx = generateCtx({
      actions,
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    getUserPermissions.mockImplementation(() => ({
      [firstId]: { actions: ['view'] },
      [secondId]: { actions: [] },
    }));

    const initialValues = [
      {
        id: firstId,
        ...pick(assignable, [
          'role',
          'gradable',
          'center',
          'statement',
          'development',
          'duration',
          'submission',
          'resources',
          'metadata',
        ]),
        asset: 'asset-id',
      },
      {
        id: secondId,
        ...pick(assignable, [
          'role',
          'gradable',
          'center',
          'statement',
          'development',
          'duration',
          'submission',
          'resources',
          'metadata',
        ]),
        asset: 'asset-id',
      },
    ];
    await ctx.db.Assignables.insertMany(initialValues);

    // Act
    const testFn = () => getAssignables({ ids: [firstId, secondId], ctx });

    // Assert
    await expect(testFn()).rejects.toThrowError(
      "You don't have permissions to see some of the requested assignables or they do not exist"
    );
  });
});

describe('Do not throw on missing property', () => {
  it('Returns empty array when not found', async () => {
    // Arrange
    const id = 'assignable-id@1.0.0';

    const { actions } = getActions({
      assignable: {},
      assetIds: [],
      mock: {
        getAsset: true,
        getRoles: true,
        getSubjects: true,
        getUserPermissions: true,
      },
    });

    const ctx = generateCtx({
      actions,
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    // Act
    const response = await getAssignables({
      ids: [id],
      throwOnMissing: false,
      ctx,
    });

    // Assert
    await expect(response).toEqual([]);
  });

  it('Omits the not found assignable', async () => {
    // Arrange
    const assignable = getAssignableObject();
    const firstId = 'assignable-id@1.0.0';
    const secondId = 'assignable-id@2.0.0';
    const assetId = 'asset-id';

    const { actions } = getActions({
      assignable,
      assetIds: [assetId],

      mock: {
        getAsset: true,
        getRoles: true,
        getSubjects: true,
        getUserPermissions: false,
      },
    });

    const ctx = generateCtx({
      actions,
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    getUserPermissions.mockImplementation(() => ({
      [firstId]: { actions: ['view'] },
      [secondId]: { actions: [] },
    }));

    const initialValues = [
      {
        id: firstId,
        ...pick(assignable, [
          'role',
          'gradable',
          'center',
          'statement',
          'development',
          'duration',
          'submission',
          'resources',
          'metadata',
        ]),
        asset: 'asset-id',
      },
      {
        id: secondId,
        ...pick(assignable, [
          'role',
          'gradable',
          'center',
          'statement',
          'development',
          'duration',
          'submission',
          'resources',
          'metadata',
        ]),
        asset: 'asset-id',
      },
    ];
    await ctx.db.Assignables.insertMany(initialValues);

    // Act
    const response = await getAssignables({
      ids: [firstId, secondId],
      throwOnMissing: false,
      ctx,
    });

    // Assert
    expect(response).toHaveLength(1);
    expect(response[0]).toHaveProperty('id', firstId);
  });
});

describe('ShowDeleted property', () => {
  it('Does not return the deleted assignables', async () => {
    // Arrange
    const assignable = getAssignableObject();
    const firstId = 'assignable-id@1.0.0';
    const secondId = 'assignable-id@2.0.0';
    const assetId = 'asset-id';

    const { actions } = getActions({
      assignable,
      assetIds: [assetId],
      mock: {
        getAsset: true,
        getRoles: true,
        getSubjects: true,
        getUserPermissions: true,
      },
    });

    const ctx = generateCtx({
      actions,
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    const initialValues = [
      {
        id: firstId,
        ...pick(assignable, [
          'role',
          'gradable',
          'center',
          'statement',
          'development',
          'duration',
          'submission',
          'resources',
          'metadata',
        ]),
        asset: 'asset-id',
      },
      {
        id: secondId,
        ...pick(assignable, [
          'role',
          'gradable',
          'center',
          'statement',
          'development',
          'duration',
          'submission',
          'resources',
          'metadata',
        ]),
        asset: 'asset-id',
        isDeleted: true,
      },
    ];
    await ctx.db.Assignables.insertMany(initialValues);

    // Act
    const response = await getAssignables({
      ids: [firstId, secondId],
      throwOnMissing: false,
      showDeleted: false,
      ctx,
    });

    // Assert
    expect(response).toHaveLength(1);
    expect(response[0]).toHaveProperty('id', firstId);
  });

  it('Does return both deleted and not deleted assignables', async () => {
    // Arrange
    const assignable = getAssignableObject();
    const firstId = 'assignable-id@1.0.0';
    const secondId = 'assignable-id@2.0.0';
    const assetId = 'asset-id';

    const { actions } = getActions({
      assignable,
      assetIds: [assetId],
      mock: {
        getAsset: true,
        getRoles: true,
        getSubjects: true,
        getUserPermissions: true,
      },
    });

    const ctx = generateCtx({
      actions,
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    const initialValues = [
      {
        id: firstId,
        ...pick(assignable, [
          'role',
          'gradable',
          'center',
          'statement',
          'development',
          'duration',
          'submission',
          'resources',
          'metadata',
        ]),
        asset: 'asset-id',
      },
      {
        id: secondId,
        ...pick(assignable, [
          'role',
          'gradable',
          'center',
          'statement',
          'development',
          'duration',
          'submission',
          'resources',
          'metadata',
        ]),
        asset: 'asset-id',
        isDeleted: true,
      },
    ];
    await ctx.db.Assignables.insertMany(initialValues);

    // Act
    const response = await getAssignables({
      ids: [firstId, secondId],
      throwOnMissing: false,
      showDeleted: true,
      ctx,
    });

    // Assert
    expect(response).toHaveLength(2);
    expect(response[0]).toHaveProperty('id', firstId);
    expect(response[1]).toHaveProperty('id', secondId);
  });
});
