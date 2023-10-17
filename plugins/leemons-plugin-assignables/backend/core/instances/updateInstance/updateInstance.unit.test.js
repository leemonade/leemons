const { beforeEach, describe, test, expect } = require('@jest/globals');
const { pick } = require('lodash');

const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { updateInstance } = require('./updateInstance');
const {
  getInstanceObject,
} = require('../../../__fixtures__/getInstanceObject');
const { instancesSchema } = require('../../../models/instances');

const {
  getUserPermission,
} = require('../../permissions/instances/users/getUserPermission');
const { updateClasses } = require('../../classes/updateClasses');
const { updateDates } = require('../../dates/updateDates');
const { getInstance } = require('../getInstance');
const { createRelatedInstance } = require('./createRelatedInstance');
const { updateEventAndAddToUsers } = require('./updateEventAndAddToUsers');

jest.mock('../../permissions/instances/users/getUserPermission');
jest.mock('../../classes/updateClasses');
jest.mock('../../dates/updateDates');
jest.mock('../getInstance');
jest.mock('./createRelatedInstance');
jest.mock('./updateEventAndAddToUsers');

const updatableFields = [
  'alwaysAvailable',
  'dates',
  'duration',
  'gradable',
  'classes',
  'students',
  'messageToAssignees',
  'curriculum',
  'metadata',
  'addNewClassStudents',
  'showResults',
  'showCorrectAnsers',
  'relatedAssignableInstances',
];

let mongooseConnection;
let disconnectMongoose;
let ctx;
let dates;
let instance;

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

  ctx = generateCtx({
    models: {
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
    },
  });

  dates = { start: new Date() };
  instance = {
    ...getInstanceObject(),
    dates,
    classes: [],
    relatedAssignableInstances: {
      before: ['relatedInstanceId1'],
    },
  };

  await ctx.tx.db.Instances.create(instance);
});

describe('updateInstance function', () => {
  test('should update instance successfully', async () => {
    // Arrange
    const propagateRelated = true;

    const changedInstance = {
      ...instance,
      dates: {},
      classes: ['classId1'],
      relatedAssignableInstances: { after: ['relatedInstanceId1'] },
    };

    getUserPermission.mockResolvedValue({
      actions: ['edit'],
    });
    getInstance.mockResolvedValue({
      ...instance,
      assignable: { id: 'assignableId1' },
    });
    createRelatedInstance.mockResolvedValue('relatedInstanceId1');
    // Act
    const response = await updateInstance({
      assignableInstance: pick(changedInstance, [
        ...updatableFields,
        'id',
        'relatedAssignables',
      ]),
      propagateRelated,
      ctx,
    });

    const dbInstance = await ctx.tx.db.Instances.findOne({
      id: instance.id,
    }).lean();

    const altResponse = await updateInstance({
      assignableInstance: pick(
        {
          ...instance,
          relatedAssignableInstances: { before: ['relatedInstanceId2'] },
        },
        [...updatableFields, 'id', 'relatedAssignables']
      ),
      propagateRelated,
      ctx,
    });

    // Assert
    expect(updateDates).toBeCalledWith({
      type: 'assignableInstance',
      instance: instance.id,
      dates: {},
      ctx,
    });
    expect(updateClasses).toBeCalledWith({
      instance: instance.id,
      assignable: 'assignableId1',
      ids: ['classId1'],
      ctx,
    });
    expect(createRelatedInstance).toBeCalledWith({
      relation: 'relatedInstanceId1',
      caller: instance.id,
      type: 'after',
      propagate: propagateRelated,
      ctx,
    });

    expect(updateEventAndAddToUsers).toBeCalledWith({
      assignable: { id: 'assignableId1' },
      dates: {},
      event: instance.event,
      id: instance.id,
      ctx,
    });
    expect(response).toEqual({
      ...changedInstance,
      id: instance.id,
      assignable: {
        id: 'assignableId1',
      },
    });
    expect(altResponse).toBeDefined();

    expect(dbInstance.relatedAssignableInstances.after).toEqual([
      'relatedInstanceId1',
    ]);
  });

  test('should throw error if some of the provided keys are not updatable', async () => {
    // Arrange

    // Act
    const testFunc = () =>
      updateInstance({
        assignableInstance: instance,
        ctx,
      });

    // Assert
    expect(testFunc).rejects.toThrowError(
      'Some of the provided keys are not updatable'
    );
  });

  test('should throw error if user has not permission to update', async () => {
    // Arrange
    const propagateRelated = true;
    getUserPermission.mockResolvedValue({
      actions: [],
    });

    // Act
    const testFunc = () =>
      updateInstance({
        assignableInstance: pick(instance, [
          ...updatableFields,
          'id',
          'relatedAssignables',
        ]),
        propagateRelated,
        ctx,
      });

    // Assert
    expect(testFunc).rejects.toThrowError(
      'You do not have permission to update this assignable instance'
    );
  });

  test('should throw error if no changes detected', async () => {
    // Arrange

    const { relatedAssignableInstances, ...modifiedInstance } = { ...instance };

    getUserPermission.mockResolvedValue({
      actions: ['edit'],
    });
    getInstance.mockResolvedValue(modifiedInstance);

    // Act
    const testFunc = () =>
      updateInstance({
        assignableInstance: pick(modifiedInstance, [
          'id',
          'relatedAssignables',
          ...updatableFields,
        ]),
        ctx,
      });

    // Assert
    await expect(testFunc).rejects.toThrowError(/No changes detected/);
  });
});
