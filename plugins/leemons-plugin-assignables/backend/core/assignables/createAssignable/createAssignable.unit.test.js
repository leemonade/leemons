const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { omit } = require('lodash');

jest.mock('../../subjects/saveSubjects');
jest.mock('../../permissions/assignables');
jest.mock('../../permissions/assignables/users/addPermissionToUser');
jest.mock('../publishAssignable');

const { createAssignable } = require('./createAssignable');
const { assignablesSchema } = require('../../../models/assignables');
const { getAssignableObject } = require('../../../__fixtures__/getAssignableObject');

const { saveSubjects } = require('../../subjects');
const { publishAssignable } = require('../publishAssignable');
const { addPermissionToUser } = require('../../permissions/assignables/users/addPermissionToUser');

const actions = {
  'assignables.roles.getRole': () => {},
  'common.versionControl.register': () => {
    const uuid = 'version-control-uuid';
    return {
      uuid,
      currentPublished: null,
      fullId: `${uuid}@1.0.0`,
    };
  },
  'leebrary.assets.add': () => {
    const uuid = 'asset-uuid';
    return {
      id: `${uuid}@1.0.0`,
    };
  },
  'leebrary.assets.duplicate': ({ assetId: id }) => ({
    id: `duplicated-asset-from-${id}`,
  }),
  'leebrary.assets.update': ({ asset }) => ({
    id: `updated-asset-from-${asset.id}`,
  }),
};

let mongooseConnection;
let disconnectMongoose;
let ctx;

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

  ctx = generateCtx({
    actions,
    models: {
      Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
    },
  });
});

const generateExpectedValue = (assignable) => ({
  ...omit(assignable, ['subjects']),
  id: actions['common.versionControl.register']().fullId,
  asset: actions['leebrary.assets.add']().id,
  metadata: {
    ...assignable.metadata,
    leebrary: {
      other: expect.stringContaining(
        actions['leebrary.assets.duplicate']({
          assetId: assignable.metadata.leebrary.other,
        }).id
      ),
      test: assignable.metadata.leebrary.test.map((asset) =>
        expect.stringContaining(actions['leebrary.assets.duplicate']({ assetId: asset }).id)
      ),
    },
  },
  resources: assignable.resources.map((resource) =>
    expect.stringContaining(actions['leebrary.assets.duplicate']({ assetId: resource }).id)
  ),
});

it('Should register the new assignable', async () => {
  // Arrange
  const assignable = getAssignableObject();
  const expectedValue = generateExpectedValue(assignable);

  // Act
  const response = await createAssignable({ assignable, ctx });
  const savedAssignable = await ctx.db.Assignables.findOne({}).lean();

  // Assert
  expect(response).toEqual(expect.objectContaining(expectedValue));
  expect(savedAssignable).toEqual(expect.objectContaining(expectedValue));
  expect(saveSubjects).toHaveBeenCalledWith(
    expect.objectContaining({
      assignableId: response.id,
      subjects: assignable.subjects,
    })
  );
});

it('Should register the new agnostic assignable (no subjects)', async () => {
  // Arrange
  let assignable = getAssignableObject();
  assignable = {
    ...assignable,
    subjects: [],
  };
  const expectedValue = generateExpectedValue(assignable);

  // Act
  const response = await createAssignable({ assignable, ctx });
  const savedAssignable = await ctx.db.Assignables.findOne({}).lean();

  // Assert
  expect(response).toEqual(expect.objectContaining(expectedValue));
  expect(savedAssignable).toEqual(expect.objectContaining(expectedValue));
  expect(saveSubjects).toHaveBeenCalledWith(
    expect.objectContaining({
      assignableId: response.id,
      subjects: assignable.subjects,
    })
  );
});

it('Should register the new assignable in published format', async () => {
  // Arrange
  const assignable = getAssignableObject();
  const expectedValue = generateExpectedValue(assignable);

  // Act
  const response = await createAssignable({ assignable, published: true, ctx });

  // Assert
  expect(response).toEqual(expect.objectContaining(expectedValue));
  expect(publishAssignable).toHaveBeenCalledWith(expect.objectContaining({ id: response.id }));
});

it('Should use the provided id and asset id for the new assignable', async () => {
  // Arrange
  const id = 'already-defined-id@25.0.0';
  const asset = 'asset-id';
  let assignable = getAssignableObject();
  assignable = {
    ...assignable,
    asset,
  };

  // Act
  const response = await createAssignable({ assignable, id, ctx });

  // Assert
  expect(response.id).toBe(id);
  expect(response.asset).toBe(asset);
});

it('Should create the userAgent permissions for the assignable', async () => {
  // Arrange
  const assignable = getAssignableObject();

  // Act
  const response = await createAssignable({ assignable, ctx });

  // Assert
  expect(addPermissionToUser).toHaveBeenCalledWith({
    id: response.id,
    userAgents: ctx.meta.userSession.userAgents.map((user) => user.id),
    role: 'owner',
    ctx,
  });
});

it('Should return an empty array of resources and no leebrary if not provided', async () => {
  // Arrange
  let assignable = getAssignableObject();
  assignable = {
    ...assignable,
    metadata: {
      ...assignable.metadata,
      leebrary: undefined,
    },
    resources: [],
  };

  const expectedValue = {
    ...omit(assignable, ['subjects', 'metadata.leebrary']),
    id: actions['common.versionControl.register']().fullId,
    asset: actions['leebrary.assets.add']().id,
    resources: [],
  };

  // Act
  const response = await createAssignable({ assignable, ctx });

  // Assert
  expect(response).toEqual(expect.objectContaining(expectedValue));
});

it('Should throw an error if no required assignable param is provided', async () => {
  // Arrange
  const assignable = getAssignableObject();

  // Act
  const noAssetFn = () => createAssignable({ assignable: omit(assignable, ['asset']), ctx });
  const noRoleFn = () => createAssignable({ assignable: omit(assignable, ['role']), ctx });

  // Assert
  await expect(noAssetFn()).rejects.toThrowError(/asset/);
  await expect(noRoleFn()).rejects.toThrowError(/role/);
});
