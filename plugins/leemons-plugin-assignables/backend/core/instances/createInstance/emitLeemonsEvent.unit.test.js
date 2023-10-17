const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { emitLeemonsEvent } = require('./emitLeemonsEvent');

it('Should emit an event', () => {
  // Arrange
  const assignable = { id: 'assignableId', role: 'student' };
  const instance = 'instanceId';

  const instanceCreatedHandler = jest.fn();
  const roleInstanceCreatedHandler = jest.fn();

  const payload = {
    role: assignable.role,
    assignable: assignable.id,
    instance,
  };

  const ctx = generateCtx({
    events: {
      'instance.created': instanceCreatedHandler,
      [`role.${assignable.role}.instance.created`]: roleInstanceCreatedHandler,
    },
  });

  // Act
  const response = emitLeemonsEvent({ assignable, instance, ctx });

  // Assert
  expect(instanceCreatedHandler).toBeCalledWith(payload);
  expect(roleInstanceCreatedHandler).toBeCalledWith(payload);
  expect(response).toBeUndefined();
});
