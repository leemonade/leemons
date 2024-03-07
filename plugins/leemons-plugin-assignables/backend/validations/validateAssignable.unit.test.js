const { it, expect } = require('@jest/globals');

const { validateAssignable } = require('./validateAssignable');
const { getAssignableObject } = require('../__fixtures__/getAssignableObject');

it('should not throw if a valid object is provided', () => {
  const assignable = getAssignableObject();

  const testFn = () => validateAssignable(assignable);

  expect(testFn).not.toThrow();
});

it('should not throw if a required property is not provided (required not enabled)', () => {
  const assignable = getAssignableObject();

  const testFn = () =>
    validateAssignable({ ...assignable, asset: undefined }, { useRequired: false });

  expect(testFn).not.toThrow();
});

it('Should throw if a required property is not provided (required enabled)', () => {
  const assignable = getAssignableObject();

  const testFn = () =>
    validateAssignable({ ...assignable, asset: undefined }, { useRequired: true });

  expect(testFn).toThrow();
});
