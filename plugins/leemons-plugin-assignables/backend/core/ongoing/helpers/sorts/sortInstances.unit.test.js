const { it, expect } = require('@jest/globals');

const { sortInstancesByDates } = require('./sortInstancesByDates');

it('Should sort instances by assignation by default', () => {
  // Arrange
  const instances = [
    { id: '1', created_at: '2019-01-01' },
    { id: '2', created_at: '2019-01-02' },
  ];
  const dates = {
    instances: { 1: { assignation: '2022-01-01' }, 2: { assignation: '2022-01-02' } },
  };
  const filters = {};
  const expectedValue = [instances[1], instances[0]];

  // Act
  const response = sortInstancesByDates({ instances, dates, filters });

  // Assert
  expect(response).toEqual(expectedValue);
});

it('Should sort instances by start date when sort filter is start', () => {
  // Arrange
  const instances = [
    { id: '1', created_at: '2000-01-01' },
    { id: '2', created_at: '2000-01-02' },
  ];
  const dates = { instances: { 1: { start: '2024-01-01' }, 2: { start: '2022-01-03' } } };
  const filters = { sort: 'start' };
  const expectedValue = [instances[1], instances[0]];

  // Act
  const response = sortInstancesByDates({ instances, dates, filters });

  // Assert
  expect(response).toEqual(expectedValue);
});

it('Should sort instances by deadline date when sort filter is deadline', () => {
  // Arrange
  const instances = [
    { id: '1', created_at: '2021-01-01' },
    { id: '2', created_at: '2021-01-02' },
  ];
  const dates = { instances: { 1: { deadline: '2023-01-01' }, 2: { deadline: '2022-01-01' } } };
  const filters = { sort: 'deadline' };
  const expectedValue = [instances[1], instances[0]];

  // Act
  const response = sortInstancesByDates({ instances, dates, filters });

  // Assert
  expect(response).toEqual(expectedValue);
});

it('Should handle the scenario where some instances do not have the property used to do the sorting', () => {
  // Arrange
  const instances = [
    { id: '1', created_at: '2020-01-02' },
    { id: '2', created_at: '2020-01-01' },
  ];
  const dates = {
    instances: {
      1: { start: '2022-06-01' },
      2: { deadline: '2023-01-01' },
    },
  };
  const expectedValueByStart = [instances[0], instances[1]];

  const expectedValueByDeadline = [instances[1], instances[0]];

  // Act
  const sortByStartResponse = sortInstancesByDates({
    instances,
    dates,
    filters: { sort: 'start' },
  });
  const sortByDeadlineResponse = sortInstancesByDates({
    instances,
    dates,
    filters: { sort: 'deadline' },
  });
  const noDatesToSortResponse = sortInstancesByDates({
    instances: [...instances],
    dates: { instances: {} },
    filters: { sort: 'start' },
  });

  // Assert
  expect(sortByStartResponse).toEqual(expectedValueByStart);
  expect(sortByDeadlineResponse).toEqual(expectedValueByDeadline);
  expect(noDatesToSortResponse).toEqual(instances);
});
