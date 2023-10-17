const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { registerEvent } = require('./registerEvent');

const getCalendarsByClassHandler = jest.fn();
const addEventHandler = jest.fn();

it('Should register an event (dates are Date objects)', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'calendar.calendar.getCalendarsByClass': getCalendarsByClassHandler,
      'calendar.calendar.addEvent': addEventHandler,
    },
  });

  const assignable = { asset: { name: 'Test Asset' } };
  const classes = ['class1', 'class2'];
  const id = 'testId';
  const isAllDay = true;
  const date = new Date();
  const dates = { deadline: date };

  getCalendarsByClassHandler.mockResolvedValue([
    { calendar: 'class1' },
    { calendar: 'class2' },
  ]);
  addEventHandler.mockResolvedValue({});

  // Act
  const response = await registerEvent({
    assignable,
    classes,
    id,
    isAllDay,
    dates,
    ctx,
  });

  // Assert
  expect(addEventHandler).toBeCalledWith({
    key: ['calendar.class.class1', 'calendar.class.class2'],
    data: {
      title: assignable.asset.name,
      isPrivate: true,
      isAllDay,
      type: 'calendar.task',
      startDate: date.toISOString(),
      endDate: date.toISOString(),
      data: {
        instanceId: id,
        classes: ['class1', 'class2'],
        hideInCalendar: false,
      },
    },
  });
  expect(response).toEqual({});
});

it('Should register an event (dates are strings)', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'calendar.calendar.getCalendarsByClass': getCalendarsByClassHandler,
      'calendar.calendar.addEvent': addEventHandler,
    },
  });

  const assignable = { asset: { name: 'Test Asset' } };
  const classes = ['class1', 'class2'];
  const id = 'testId';
  const isAllDay = true;
  const date = new Date();
  const dates = { deadline: date.toISOString() };

  getCalendarsByClassHandler.mockResolvedValue([
    { calendar: 'class1' },
    { calendar: 'class2' },
  ]);
  addEventHandler.mockResolvedValue({});

  // Act
  const response = await registerEvent({
    assignable,
    classes,
    id,
    isAllDay,
    dates,
    ctx,
  });

  // Assert
  expect(addEventHandler).toBeCalledWith({
    key: ['calendar.class.class1', 'calendar.class.class2'],
    data: {
      title: assignable.asset.name,
      isPrivate: true,
      isAllDay,
      type: 'calendar.task',
      startDate: date.toISOString(),
      endDate: date.toISOString(),
      data: {
        instanceId: id,
        classes: ['class1', 'class2'],
        hideInCalendar: false,
      },
    },
  });
  expect(response).toEqual({});
});

it('Should register an event without dates (dates are undefined)', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'calendar.calendar.getCalendarsByClass': getCalendarsByClassHandler,
      'calendar.calendar.addEvent': addEventHandler,
    },
  });

  const assignable = { asset: { name: 'Test Asset' } };
  const classes = ['class1', 'class2'];
  const id = 'testId';
  const isAllDay = true;
  const dates = {};

  getCalendarsByClassHandler.mockResolvedValue([
    { calendar: 'class1' },
    { calendar: 'class2' },
  ]);
  addEventHandler.mockResolvedValue({});

  // Act
  const response = await registerEvent({
    assignable,
    classes,
    id,
    isAllDay,
    dates,
    ctx,
  });

  // Assert
  expect(addEventHandler).toBeCalledWith({
    key: ['calendar.class.class1', 'calendar.class.class2'],
    data: {
      title: assignable.asset.name,
      isPrivate: true,
      isAllDay,
      type: 'calendar.task',
      startDate: undefined,
      endDate: undefined,
      data: {
        instanceId: id,
        classes: ['class1', 'class2'],
        hideInCalendar: true,
      },
    },
  });
  expect(response).toEqual({});
});
