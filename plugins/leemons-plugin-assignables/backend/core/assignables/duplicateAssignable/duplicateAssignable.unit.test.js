const { it, expect, jest: globalJest } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

globalJest.mock('../getAssignable');
globalJest.mock('../createAssignable');

const { cloneDeep } = require('lodash');
const { duplicateAssignable } = require('./duplicateAssignable');

const { getAssignable } = require('../getAssignable');
const { createAssignable } = require('../createAssignable');
const {
  getAssignableObject,
} = require('../../../__fixtures__/getAssignableObject');

it('Duplicates the assignable', async () => {
  // Arrange
  const assignable = getAssignableObject();
  const expectedValue = {
    id: 'duplicated-assignable',
    message: 'This corresponds to the duplicated assignable',
  };

  getAssignable.mockImplementation(() => cloneDeep(assignable));
  createAssignable.mockImplementation(() => expectedValue);

  const ctx = generateCtx({});

  // Act
  const response = await duplicateAssignable({ id: 'assignable-id', ctx });

  // Assert
  expect(response).toEqual(expectedValue);
  expect(createAssignable).toBeCalledWith(
    expect.objectContaining({
      assignable: {
        ...assignable,
        asset: { ...assignable.asset, name: `${assignable.asset.name} (1)` },
      },
      published: false,
    })
  );
});

it('Duplicates the assignable in publish mode', async () => {
  // Arrange
  const assignable = getAssignableObject();
  const expectedValue = {
    id: 'duplicated-assignable',
    message: 'This corresponds to the duplicated assignable',
  };

  getAssignable.mockImplementation(() => cloneDeep(assignable));
  createAssignable.mockImplementation(() => expectedValue);

  const ctx = generateCtx({});

  // Act
  await duplicateAssignable({ id: 'assignable-id', published: true, ctx });

  // Assert
  expect(createAssignable).toBeCalledWith(
    expect.objectContaining({
      published: true,
    })
  );
});
