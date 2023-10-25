// TODO Add tests for else branches (main flow is covered)

const { describe, it, expect, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { LeemonsError } = require('@leemons/error');

const { updateAssignable } = require('./updateAssignable');
const { assignablesSchema } = require('../../../models/assignables');

const { getAssignableObject } = require('../../../__fixtures__/getAssignableObject');

jest.mock('../getAssignable');
const { getAssignable } = require('../getAssignable');

jest.mock('../createAssignable');
const { createAssignable } = require('../createAssignable');

jest.mock('../../permissions/assignables/users/getUserPermission');
const { getUserPermission } = require('../../permissions/assignables/users/getUserPermission');

jest.mock('../../leebrary/assets/updateAsset');
const { updateAsset } = require('../../leebrary/assets/updateAsset');

jest.mock('../listAssignableUserAgents');
const { listAssignableUserAgents } = require('../listAssignableUserAgents');

jest.mock('../addUserToAssignable');
const { addUserToAssignable } = require('../addUserToAssignable');

jest.mock('../publishAssignable');
const { publishAssignable } = require('../publishAssignable');

jest.mock('../../subjects/updateSubjects');
const { updateSubjects } = require('../../subjects/updateSubjects');

jest.mock('../../leebrary/assets/duplicateAsset');
const { duplicateAsset } = require('../../leebrary/assets/duplicateAsset');

jest.mock('../../leebrary/assets/removeAsset');
const { removeAsset } = require('../../leebrary/assets/removeAsset');

const metadata = {
  leebrary: {
    key1: [
      {
        id: 'resource1',
        preserveName: true,
        public: 1,
        indexable: 0,
      },
      {
        id: 'resource2',
        preserveName: true,
        public: 1,
        indexable: 0,
      },
    ],
    key2: {
      id: 'resource3',
      preserveName: true,
      public: 1,
      indexable: 0,
    },
  },
};

const resources = [
  '550e8400-e29b-41d4-a716-446655440000@1.0.0',
  '550e8400-e29b-41d4-a716-446655440000@2.0.1',
];

const subjects = [
  {
    program: '550e8400-e29b-41d4-a716-446655440011',
    subject: '550e8400-e29b-41d4-a716-446655440010',
    level: '1',
  },
];

describe('updateAssignable function', () => {
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
    jest.resetAllMocks();
  });

  it('should upgrade and publish the assignable correctly', async () => {
    // Arrange
    const assignable = getAssignableObject();
    assignable.asset = { ...assignable.asset, id: 'assetId', file: 'fileId' };
    assignable.id = 'assignableId';
    assignable.file = 'fileId';
    const updatedAssignable = {
      ...assignable,
      resources,
      metadata,
    };

    updatedAssignable.metadata.leebrary.key1 = {
      id: 'resource4',
      preserveName: true,
      public: 1,
      indexable: 0,
    };

    const ctx = generateCtx({
      actions: {
        'common.versionControl.getVersion': jest.fn().mockReturnValue({ published: true }),
        'common.versionControl.upgradeVersion': jest
          .fn()
          .mockReturnValue({ fullId: 'assetId@2.0.0' }),
      },
    });

    getAssignable.mockReturnValue(assignable);
    getUserPermission.mockReturnValue({ actions: ['edit'] });
    updateAsset.mockReturnValue({ id: 'assetId' });
    createAssignable.mockReturnValue(updatedAssignable);
    listAssignableUserAgents.mockReturnValue([
      { id: 'agent1', role: 'role1' },
      { id: 'agent2', role: 'role2' },
    ]);

    // Act
    const responseWithPublish = await updateAssignable({
      assignable: updatedAssignable,
      published: true,
      ctx,
    });

    const responseWithoutPublish = await updateAssignable({
      assignable: updatedAssignable,
      published: false,
      ctx,
    });

    // Assert
    expect(getAssignable).toBeCalledWith({ id: updatedAssignable.id, ctx });
    expect(getUserPermission).toBeCalledWith({
      assignableId: assignable.id,
      ctx,
    });
    expect(updateAsset).toBeCalledWith({
      asset: { ...updatedAssignable.asset, file: updatedAssignable.file },
      upgrade: true,
      published: false,
      scale: 'major',
      ctx,
    });
    expect(listAssignableUserAgents).toBeCalledWith({
      assignableId: updatedAssignable.id,
      ctx,
    });
    expect(addUserToAssignable).toBeCalledWith(
      expect.objectContaining({ assignableId: 'assetId@2.0.0', ctx })
    );
    expect(publishAssignable).toBeCalledWith({ id: 'assetId@2.0.0', ctx });
    expect(publishAssignable).toBeCalledTimes(1);
    expect(responseWithPublish).toEqual({
      ...updatedAssignable,
      published: true,
    });
    expect(responseWithoutPublish).toEqual({
      ...updatedAssignable,
      published: false,
    });
  });

  it('update the assignable subject correctly', async () => {
    // Arrange

    const assignable = getAssignableObject();
    assignable.asset = { ...assignable.asset, id: 'assetId', file: 'fileId' };
    assignable.id = 'assignableId';
    assignable.file = 'fileId';

    const updatedAssignable = {
      ...assignable,
      subjects,
    };

    const ctx = generateCtx({
      actions: {
        'common.versionControl.getVersion': jest.fn().mockReturnValue({ published: false }),
        'common.versionControl.upgradeVersion': jest
          .fn()
          .mockReturnValue({ fullId: 'assetId@2.0.0' }),
      },
    });

    getAssignable.mockReturnValue(assignable);
    getUserPermission.mockReturnValue({ actions: ['edit'] });
    updateAsset.mockReturnValue({ id: 'assetId' });
    createAssignable.mockReturnValue(updatedAssignable);
    listAssignableUserAgents.mockReturnValue([
      { id: 'agent1', role: 'role1' },
      { id: 'agent2', role: 'role2' },
    ]);
    updateSubjects.mockReturnValue(subjects);
    duplicateAsset.mockReturnValue({
      id: '550e8400-e29b-41d4-a716-446655440000@2.0.1',
    });

    // Act
    const response = await updateAssignable({
      assignable: updatedAssignable,
      published: true,
      ctx,
    });

    // Assert
    expect(getAssignable).toBeCalledWith({ id: updatedAssignable.id, ctx });
    expect(getUserPermission).toBeCalledWith({
      assignableId: assignable.id,
      ctx,
    });
    expect(updateAsset).toBeCalledWith({
      asset: { ...updatedAssignable.asset, file: updatedAssignable.file },
      upgrade: true,
      published: false,
      scale: 'major',
      ctx,
    });
    expect(publishAssignable).not.toBeCalled();

    expect(duplicateAsset).not.toBeCalled();

    expect(response).toEqual({
      ...updatedAssignable,
      id: updatedAssignable.id,
    });
  });

  it('update the assignable correctly', async () => {
    // Arrange

    const assignable = getAssignableObject();
    assignable.asset = { ...assignable.asset, id: 'assetId', file: 'fileId' };
    assignable.id = 'assignableId';
    assignable.file = 'fileId';

    const updatedAssignable = {
      ...assignable,
      resources,
      subjects,
      submission: { id: 'submissionId' },
    };

    const ctx = generateCtx({
      actions: {
        'common.versionControl.getVersion': jest.fn().mockReturnValue({ published: false }),
        'common.versionControl.upgradeVersion': jest
          .fn()
          .mockReturnValue({ fullId: 'assetId@2.0.0' }),
      },
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    await ctx.tx.db.Assignables.create({ ...assignable, asset: 'assetId1' });

    getAssignable.mockReturnValue(assignable);
    getUserPermission.mockReturnValue({ actions: ['edit'] });
    updateAsset.mockReturnValue({ id: 'assetId' });
    createAssignable.mockReturnValue(updatedAssignable);
    listAssignableUserAgents.mockReturnValue([
      { id: 'agent1', role: 'role1' },
      { id: 'agent2', role: 'role2' },
    ]);
    updateSubjects.mockReturnValue(subjects);
    duplicateAsset.mockReturnValue({
      id: '550e8400-e29b-41d4-a716-446655440000@2.0.1',
    });

    // Act
    const response = await updateAssignable({
      assignable: updatedAssignable,
      published: true,
      ctx,
    });
    const resultAssignable = await ctx.tx.db.Assignables.findOne({
      id: updatedAssignable.id,
    }).lean();

    // Assert
    expect(getAssignable).toBeCalledWith({ id: updatedAssignable.id, ctx });
    expect(getUserPermission).toBeCalledWith({
      assignableId: assignable.id,
      ctx,
    });
    expect(updateAsset).toBeCalledWith({
      asset: { ...updatedAssignable.asset, file: updatedAssignable.file },
      upgrade: true,
      published: false,
      scale: 'major',
      ctx,
    });
    expect(publishAssignable).toBeCalledWith({ id: updatedAssignable.id, ctx });

    expect(duplicateAsset).toBeCalledWith({
      id: '550e8400-e29b-41d4-a716-446655440000@2.0.1',
      preserveName: true,
      public: 1,
      indexable: 0,
      ctx,
    });
    expect(removeAsset).toBeCalledWith({
      id: '550e8400-e29b-41d4-a716-446655440000@2.0.0',
      ctx,
    });

    expect(response).toEqual({
      ...updatedAssignable,
      metadata: expect.objectContaining({ leebrary: expect.any(Object) }),
      published: true,
    });
    expect(resultAssignable.resources.length).toBe(2);
    expect(resultAssignable.submission).toBeDefined();
  });

  it('correctly updates the resources in the metadata', async () => {
    // Arrange
    const assignable = getAssignableObject();
    assignable.asset = { ...assignable.asset, id: 'assetId', file: 'fileId' };
    assignable.id = 'assignableId';
    assignable.file = 'fileId';
    assignable.metadata = {
      leebrary: {
        key1: ['resource1', 'resource2'],
        key2: ['resource3'],
      },
    };

    const updatedAssignable = {
      ...assignable,
      metadata: {
        leebrary: {
          key1: ['resource3'],
        },
      },
    };

    const ctx = generateCtx({
      actions: {
        'common.versionControl.getVersion': jest.fn().mockReturnValue({ published: false }),
        'common.versionControl.upgradeVersion': jest
          .fn()
          .mockReturnValue({ fullId: 'assetId@2.0.0' }),
      },
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    getAssignable.mockReturnValue(assignable);
    getUserPermission.mockReturnValue({ actions: ['edit'] });
    updateAsset.mockReturnValue({ id: 'assetId' });
    createAssignable.mockReturnValue(updatedAssignable);
    listAssignableUserAgents.mockReturnValue([
      { id: 'agent1', role: 'role1' },
      { id: 'agent2', role: 'role2' },
    ]);
    duplicateAsset.mockReturnValue({ id: 'resource3' });

    // Act
    const response = await updateAssignable({
      assignable: updatedAssignable,
      published: true,
      ctx,
    });

    // Assert
    expect(getAssignable).toBeCalledWith({ id: updatedAssignable.id, ctx });
    expect(getUserPermission).toBeCalledWith({
      assignableId: assignable.id,
      ctx,
    });
    expect(updateAsset).toBeCalledWith({
      asset: { ...updatedAssignable.asset, file: updatedAssignable.file },
      upgrade: true,
      published: false,
      scale: 'major',
      ctx,
    });
    expect(duplicateAsset).toBeCalledWith({
      id: 'resource3',
      preserveName: true,
      public: 1,
      indexable: 0,
      ctx,
    });
    expect(removeAsset).toBeCalledWith({
      id: 'resource1',
      ctx,
    });
    expect(response).toEqual({
      ...updatedAssignable,
      metadata: expect.objectContaining({ leebrary: expect.any(Object) }),
      published: true,
    });
  });

  it('correctly updates the resources in metadata when metadata.leebrary is not an array', async () => {
    // Arrange
    const assignable = getAssignableObject();
    assignable.asset = { ...assignable.asset, id: 'assetId', file: 'fileId' };
    assignable.id = 'assignableId';
    assignable.file = 'fileId';
    assignable.metadata = {
      leebrary: {
        key1: 'resource1',
        key2: 'resource2',
      },
    };

    const updatedAssignable = {
      ...assignable,
      metadata: {
        leebrary: {
          key1: 'resource3',
        },
      },
    };

    const ctx = generateCtx({
      actions: {
        'common.versionControl.getVersion': jest.fn().mockReturnValue({ published: false }),
        'common.versionControl.upgradeVersion': jest
          .fn()
          .mockReturnValue({ fullId: 'assetId@2.0.0' }),
      },
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      },
    });

    getAssignable.mockReturnValue(assignable);
    getUserPermission.mockReturnValue({ actions: ['edit'] });
    updateAsset.mockReturnValue({ id: 'assetId' });
    createAssignable.mockReturnValue(updatedAssignable);
    listAssignableUserAgents.mockReturnValue([
      { id: 'agent1', role: 'role1' },
      { id: 'agent2', role: 'role2' },
    ]);
    duplicateAsset.mockReturnValue({ id: 'resource3' });

    // Act
    const response = await updateAssignable({
      assignable: updatedAssignable,
      published: true,
      ctx,
    });

    // Assert
    expect(getAssignable).toBeCalledWith({ id: updatedAssignable.id, ctx });
    expect(getUserPermission).toBeCalledWith({
      assignableId: assignable.id,
      ctx,
    });
    expect(updateAsset).toBeCalledWith({
      asset: { ...updatedAssignable.asset, file: updatedAssignable.file },
      upgrade: true,
      published: false,
      scale: 'major',
      ctx,
    });
    expect(duplicateAsset).toBeCalledWith({
      id: 'resource3',
      preserveName: true,
      public: 1,
      indexable: 0,
      ctx,
    });
    expect(removeAsset).toBeCalledWith({
      id: 'resource1',
      ctx,
    });

    expect(response).toEqual({
      ...updatedAssignable,
      metadata: expect.objectContaining({ leebrary: expect.any(Object) }),
      published: true,
    });
  });

  it('Throws an error if no changes detected', async () => {
    const assignable = getAssignableObject();

    const ctx = generateCtx({
      actions: {
        'common.versionControl.getVersion': jest.fn(),
        'common.versionControl.upgradeVersion': jest
          .fn()
          .mockReturnValue({ fullId: 'assetId@2.0.0' }),
      },
    });

    getAssignable.mockReturnValue(assignable);
    getUserPermission.mockReturnValue({ actions: ['edit'] });

    // Act
    const testFn = () => updateAssignable({ assignable, ctx });
    const testFn2 = () => updateAssignable({ assignable: {}, ctx });

    // Assert
    await expect(testFn()).rejects.toThrow(
      new LeemonsError(ctx, {
        message: 'Failed to update assignable: No changes detected',
      })
    );
    await expect(testFn2()).rejects.toThrow(
      new LeemonsError(ctx, {
        message: 'Failed to update assignable: No changes detected',
      })
    );
  });

  it('Throws an error if assignable is deleted', async () => {
    const assignable = getAssignableObject();

    const ctx = generateCtx({
      actions: {
        'common.versionControl.getVersion': jest.fn(),
        'common.versionControl.upgradeVersion': jest
          .fn()
          .mockReturnValue({ fullId: 'assetId@2.0.0' }),
      },
    });

    getAssignable.mockReturnValue({ ...assignable, deleted: true });

    // Act
    const testFn = () => updateAssignable({ assignable, ctx });

    // Assert

    await expect(testFn()).rejects.toThrow(
      new LeemonsError(ctx, {
        message: 'Failed to update assignable: The assignable is deleted',
      })
    );
  });

  it('Throws an error if user has not edit permission', async () => {
    const assignable = getAssignableObject();

    const ctx = generateCtx({
      actions: {
        'common.versionControl.getVersion': jest.fn(),
        'common.versionControl.upgradeVersion': jest.fn(),
      },
    });

    getAssignable.mockReturnValue(assignable);
    getUserPermission.mockReturnValue({ actions: ['view'] });

    // Act
    const testFn = () => updateAssignable({ assignable, ctx });

    // Assert
    await expect(testFn()).rejects.toThrow(
      new LeemonsError(ctx, {
        message: 'Failed to update assignable: You do not have permissions',
      })
    );
  });
});
