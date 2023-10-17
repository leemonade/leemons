const {
  it,
  expect,
  beforeEach,
  jest: { spyOn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { updateEventAndAddToUsers } = require('./updateEventAndAddToUsers');

const { listInstanceClasses } = require('../../classes');
const { updateEvent } = require('../calendar');

jest.mock('../calendar/updateEvent');
jest.mock('../../classes/listInstanceClasses');

let ctx;

beforeEach(async () => {
  ctx = generateCtx({});
});

it('Should update event and add to users', async () => {
  // Arrange
  const event = 'eventId';
  const assignable = 'assignableId';
  const dates = { start: new Date(), end: new Date() };
  const id = 'instanceId';

  const instanceClasses = [
    {
      assignable,
      instance: id,
      class: 'classId1',
    },
    {
      assignable,
      instance: id,
      class: 'classId2',
    },
  ];
  listInstanceClasses.mockResolvedValue(instanceClasses);

  // Act

  const response = await updateEventAndAddToUsers({
    assignable,
    event,
    dates,
    id,
    ctx,
  });

  // Assert
  expect(listInstanceClasses).toHaveBeenCalledWith({ id, ctx });
  expect(updateEvent).toHaveBeenCalledWith({
    event,
    assignable,
    classes: instanceClasses.map((instance) => instance.class),
    dates,
    ctx,
  });
  expect(response).toBeUndefined();
});

// testear si hay un error
it('Should log an error if there is an error', async () => {
  // Arrange
  const event = 'eventId2';
  const assignable = 'assignableId';
  const dates = { start: new Date(), end: new Date() };
  const id = 'instanceId';

  const spyErrorLogger = spyOn(ctx.logger, 'error');

  updateEvent.mockImplementation(() => {
    throw new Error('error');
  });

  // Act
  const resp = await updateEventAndAddToUsers({
    assignable,
    event,
    dates,
    id,
    ctx,
  });

  // Assert
  expect(spyErrorLogger).toBeCalled();
  expect(resp).toBeUndefined();
});
