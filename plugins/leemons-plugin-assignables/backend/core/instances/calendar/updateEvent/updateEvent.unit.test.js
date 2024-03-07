const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { updateEvent } = require('./updateEvent');

const updateEventHandler = jest.fn();

it('Should update an event (dates are Date objects)', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'calendar.calendar.updateEvent': updateEventHandler,
    },
  });

  const assignable = { asset: { name: 'Test Asset' } };
  const classes = ['class1', 'class2'];
  const eventId = 'testId';
  const dates = { startDate: new Date(), deadline: new Date() };

  updateEventHandler.mockResolvedValue({});

  // Act
  const response = await updateEvent({
    eventId,
    assignable,
    classes,
    dates,
    ctx,
  });

  // Assert
  expect(updateEventHandler).toBeCalledWith({
    id: eventId,
    data: {
      title: assignable.asset.name,
      isPrivate: true,
      type: 'calendar.task',
      startDate: dates.startDate.toISOString(),
      endDate: dates.deadline.toISOString(),
    },
    calendar: { calendar: ['calendar.class.class1', 'calendar.class.class2'] },
  });
  expect(response).toEqual({});
});

it('Should update an event (dates are Strings)', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'calendar.calendar.updateEvent': updateEventHandler,
    },
  });

  const assignable = { asset: { name: 'Test Asset' } };
  const classes = ['class1', 'class2'];
  const eventId = 'testId';
  const dates = {
    startDate: new Date().toISOString(),
    deadline: new Date().toISOString(),
  };

  updateEventHandler.mockResolvedValue({});

  // Act
  const response = await updateEvent({
    eventId,
    assignable,
    classes,
    dates,
    ctx,
  });

  // Assert
  expect(updateEventHandler).toBeCalledWith({
    id: eventId,
    data: {
      title: assignable.asset.name,
      isPrivate: true,
      type: 'calendar.task',
      startDate: dates.startDate,
      endDate: dates.deadline,
    },
    calendar: { calendar: ['calendar.class.class1', 'calendar.class.class2'] },
  });
  expect(response).toEqual({});
});
