// Importing required modules and functions
const { it, beforeEach, expect } = require('@jest/globals');
const { map } = require('lodash');

const { generateCtx } = require('@leemons/testing');

const { createEventAndAddToUsers } = require('./createEventAndAddToUsers');
const { registerEvent } = require('../calendar/registerEvent');

jest.mock('../calendar/registerEvent');

const grantAccessUserAgentToEventHandler = jest.fn();

let ctx;
let eventId;

beforeEach(() => {
  jest.resetAllMocks();

  ctx = generateCtx({
    actions: {
      'calendar.calendar.grantAccessUserAgentToEvent':
        grantAccessUserAgentToEventHandler,
    },
  });
  eventId = 'eventId';
});

// Test case for createEventAndAddToUsers function
it('Should handle createEventAndAddToUsers correctly', async () => {
  // Arrange

  const params = {
    assignable: 'assignableId',
    classes: ['class1', 'class2'],
    id: 'instanceId',
    dates: ['2022-01-01', '2022-01-02'],
    isAllDay: true,
    teachers: [{ teacher: 'teacher1' }, { teacher: 'teacher2' }],
    students: ['student1', 'student2'],
    ctx,
  };

  registerEvent.mockReturnValue({ id: eventId });

  // Act
  const response = await createEventAndAddToUsers(params);

  // Assert
  expect(registerEvent).toBeCalledWith({
    assignable: params.assignable,
    classes: params.classes,
    id: params.id,
    dates: params.dates,
    isAllDay: params.isAllDay,
    ctx,
  });
  expect(grantAccessUserAgentToEventHandler).toHaveBeenNthCalledWith(1, {
    id: eventId,
    userAgentId: map(params.teachers, 'teacher'),
    actionName: 'view',
  });
  expect(grantAccessUserAgentToEventHandler).toHaveBeenNthCalledWith(2, {
    id: eventId,
    userAgentId: params.students,
    actionName: 'view',
  });
  expect(response).toBe(eventId);
});

it('Should handle createEventAndAddToUsers with no teachers', async () => {
  // Arrange
  const params = {
    assignable: 'assignableId',
    classes: ['class1', 'class2'],
    id: 'instanceId',
    dates: ['2022-01-01', '2022-01-02'],
    isAllDay: true,
    teachers: [],
    students: ['student1', 'student2'],
    ctx,
  };

  registerEvent.mockReturnValue({ id: eventId });

  // Act
  const response = await createEventAndAddToUsers(params);

  // Assert
  expect(grantAccessUserAgentToEventHandler).toBeCalledWith({
    id: eventId,
    userAgentId: params.students,
    actionName: 'view',
  });

  expect(response).toBe(eventId);
});

it('Should handle createEventAndAddToUsers with no students', async () => {
  // Arrange
  const params = {
    assignable: 'assignableId',
    classes: ['class1', 'class2'],
    id: 'instanceId',
    dates: ['2022-01-01', '2022-01-02'],
    isAllDay: true,
    teachers: [{ teacher: 'teacher1' }, { teacher: 'teacher2' }],
    students: [],
    ctx,
  };

  registerEvent.mockReturnValue({ id: eventId });

  // Act
  const response = await createEventAndAddToUsers(params);

  // Assert
  expect(grantAccessUserAgentToEventHandler).toHaveBeenCalledWith({
    id: eventId,
    userAgentId: map(params.teachers, 'teacher'),
    actionName: 'view',
  });
  expect(response).toBe(eventId);
});

it('Should not grant access to Event if no event is created', async () => {
  // Arrange
  const params = {
    assignable: 'assignableId',
    classes: ['class1', 'class2'],
    id: 'instanceId',
    dates: ['2022-01-01', '2022-01-02'],
    isAllDay: true,
    teachers: [],
    students: ['student1', 'student2'],
    ctx,
  };
  registerEvent.mockReturnValue({ id: null });

  // Act
  expect(grantAccessUserAgentToEventHandler).not.toBeCalled();
  const response = await createEventAndAddToUsers(params);

  // Assert
  expect(response).toBe(null);
});
