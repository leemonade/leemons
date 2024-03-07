const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { createRelatedInstance } = require('./createRelatedInstance');
const {
  getInstanceObject,
} = require('../../../__fixtures__/getInstanceObject');

const { getInstance } = require('../getInstance');
const { createInstance } = require('../createInstance');
const { updateInstance } = require('./updateInstance');

jest.mock('../getInstance');
jest.mock('../createInstance');
jest.mock('./updateInstance');

let instance;
let ctx;

beforeEach(async () => {
  jest.resetAllMocks();
  ctx = generateCtx({});
  instance = {
    ...getInstanceObject(),
    relatedAssignableInstances: { after: [{ id: 'afterId1' }] },
  };
});

it('Should create a related instance successfully', async () => {
  // Arrange
  const caller = { id: 'callerInstanceId1' };
  const relation = { id: 'relationId' };
  const type = 'before';

  getInstance.mockResolvedValue(instance);

  // Act
  const response = await createRelatedInstance({ caller, relation, type, ctx });

  // Assert
  expect(getInstance).toBeCalledWith({ id: relation.id, ctx });
  expect(updateInstance).toBeCalledWith({
    assignableInstance: {
      id: 'relationId',
      relatedAssignableInstances: {
        ...instance.relatedAssignableInstances,
        before: [],
        after: [
          ...instance.relatedAssignableInstances.after,
          {
            id: caller,
          },
        ],
      },
    },
    propagateRelated: false,
    ctx,
  });
  expect(response).toBe(relation);
  expect(createInstance).not.toBeCalled();
});

it('Should create a related instance successfully if relation is an object (without id)', async () => {
  // Arrange
  const caller = { id: 'callerInstanceId1' };
  const relation = {
    instance: {
      relatedAssignableInstances: {},
    },
  };
  const type = 'before';

  getInstance.mockResolvedValue(instance);
  createInstance.mockResolvedValue({ id: 'createdInstanceId' });

  // Act
  const response = await createRelatedInstance({ caller, relation, type, ctx });

  // Assert
  expect(getInstance).not.toBeCalled();
  expect(updateInstance).not.toBeCalled();
  expect(createInstance).toBeCalledWith({
    assignableInstance: {
      relatedAssignableInstances: {
        ...relation.instance.relatedAssignableInstances,
        before: [
          ...(relation.instance.relatedAssignableInstances?.before || []),
        ],
        after: [
          ...(relation.instance.relatedAssignableInstances?.after || []),
          caller.id,
        ],
      },
    },
    ctx,
  });
  const { instance: kk, ...relationResp } = {
    ...relation,
    id: 'createdInstanceId',
  };
  expect(response).toEqual(relationResp);
});

it('Should throw an error if the related instance does not exist', async () => {
  // Arrange
  const caller = 'callerId';
  const relation = { id: 'nonExistentId' };
  const type = 'after';
  const propagate = true;

  getInstance.mockResolvedValue(null);

  // Act
  const testFunc = () =>
    createRelatedInstance({ caller, relation, type, propagate, ctx });

  // Assert
  await expect(testFunc).rejects.toThrowError(
    /The related instance nonExistentId does not exists/
  );
  expect(getInstance).toBeCalled();
  expect(updateInstance).not.toBeCalled();
});
