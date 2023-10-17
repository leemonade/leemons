/* eslint-disable sonarjs/no-duplicate-string */

const { it, beforeEach, expect } = require('@jest/globals');

const { sortByDates } = require('./sortByDates');

beforeEach(() => {
  jest.resetAllMocks();
});

it('Should sort instances by date', () => {
  // Arrange
  const instances = [
    {
      id: 'instanceId1',
      close: '2022-01-01',
      closed: '2022-01-03',
      deadline: '2022-01-02',
      start: '2022-01-01',
    },
    {
      id: 'instanceId2',
      close: '2022-01-01',
      closed: '2022-01-01',
      deadline: undefined,
      start: '2022-01-01',
    },
    {
      id: 'instanceId3',
      close: '2022-01-01',
      closed: '2022-01-02',
      deadline: '2022-01-03',
      start: '2022-01-01',
    },
  ];

  // Act
  const resp = sortByDates(instances, ['close', 'closed', 'deadline']);

  // Assert
  expect(resp.map((el) => el.id)).toEqual(['instanceId2', 'instanceId3', 'instanceId1']);
});

it('Should sort instances by date when some date is undefined', () => {
  // Arrange
  const instances = [
    {
      id: 'instanceId1',
      close: '2022-01-01',
      closed: '2022-01-03',
      deadline: '2022-01-02',
    },
    {
      id: 'instanceId2',
      close: '2022-01-01',
      closed: '2022-01-01',
      deadline: undefined,
    },
    {
      id: 'instanceId3',
      close: '2022-01-01',
      closed: '2022-01-02',
      deadline: '2022-01-03',
    },
  ];

  // Act
  const resp = sortByDates(instances, ['deadline', 'close', 'closed']);

  // Assert

  expect(resp.map((el) => el.id)).toEqual(['instanceId1', 'instanceId3', 'instanceId2']);
});

it('Should mantain instances order if all dates are same', () => {
  // Arrange
  const instances = [
    {
      id: 'instanceId1',
      start: '2022-01-01',
    },
    {
      id: 'instanceId2',
      start: '2022-01-01',
    },
    {
      id: 'instanceId3',
      start: '2022-01-01',
    },
  ];

  // Act
  const resp = sortByDates(instances, ['start']);

  // Assert
  expect(resp.map((el) => el.id)).toEqual(['instanceId1', 'instanceId2', 'instanceId3']);
});
