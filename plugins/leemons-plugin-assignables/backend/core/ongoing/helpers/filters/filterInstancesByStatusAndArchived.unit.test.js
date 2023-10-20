const { it, expect, beforeEach } = require('@jest/globals');

const { filterInstancesByStatusAndArchived } = require('./filterInstancesByStatusAndArchived');

// MOCKS
jest.mock('../activitiesStatus');
const { getInstancesStatus } = require('../activitiesStatus');

beforeEach(() => jest.resetAllMocks());

it('Should not filter when not filtering by status and isArchived are undefined', () => {
  // Arrange
  const instances = [{ id: 'instanceOne' }, { id: 'instanceTwo' }];
  const filters = {};
  const dates = { instances: { instanceOne: new Date() }, assignations: {} };

  // Act
  const response = filterInstancesByStatusAndArchived({ instances, filters, dates });

  // Assert
  expect(response).toEqual(instances);
});

it('Should correctly filter archived instances', () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    alwaysAvailable: 0,
  };
  const instanceTwo = {
    id: 'instanceTwo',
    alwaysAvailable: 0,
  };
  const instances = [instanceOne, instanceTwo];
  const dates = {
    instances: {
      [instanceTwo.id]: { archived: new Date('October 31, 1993') },
    },
    assignations: {},
  };

  // Act
  const responseNoArchived = filterInstancesByStatusAndArchived({
    instances,
    filters: { isArchived: false },
    dates,
  });
  const responseShowArchived = filterInstancesByStatusAndArchived({
    instances,
    filters: { isArchived: 'true' }, // It should recognize a stringified true value
    dates,
  });

  // Assert
  expect(getInstancesStatus).not.toBeCalled();
  expect(responseNoArchived).toEqual([instanceOne]);
  expect(responseShowArchived).toEqual([instanceTwo]);
});

it('Should correctly filter instances by status', () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    alwaysAvailable: 0,
  };
  const instanceTwo = {
    id: 'instanceTwo',
    alwaysAvailable: 0,
  };
  const instances = [instanceOne, instanceTwo];
  const filters = { status: 'open' };
  const dates = {
    instances: {
      [instanceOne.id]: { start: new Date('November 31, 1993') },
      [instanceTwo.id]: {
        start: new Date('October 31, 1993'),
        closed: new Date('December 31, 1993'),
      },
    },
    assignations: {},
  };
  const expectedResponse = [instanceOne];

  getInstancesStatus.mockReturnValue(['open', 'closed']);

  // Act
  const response = filterInstancesByStatusAndArchived({ instances, filters, dates });

  // Assert
  expect(getInstancesStatus).toBeCalledWith([
    {
      id: instanceOne.id,
      alwaysAvailable: instanceOne.alwaysAvailable,
      dates: dates.instances[instanceOne.id],
    },
    {
      id: instanceTwo.id,
      alwaysAvailable: instanceTwo.alwaysAvailable,
      dates: dates.instances[instanceTwo.id],
    },
  ]);
  expect(response).toEqual(expectedResponse);
});

it('Should correctly filter instances by visibility date for students', () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    alwaysAvailable: 0,
  };
  const instanceTwo = {
    id: 'instanceTwo',
    alwaysAvailable: 0,
  };
  const instanceThree = {
    id: 'instanceThree',
    alwaysAvailable: 1,
  };
  const instances = [instanceOne, instanceTwo, instanceThree];
  const dates = {
    instances: {
      [instanceOne.id]: { start: new Date('December 31, 2099') },
      [instanceTwo.id]: { visualization: new Date('December 31, 1993') },
    },
    assignations: {},
  };
  const expectedResponse = [instanceTwo, instanceThree];

  // Act
  const response = filterInstancesByStatusAndArchived({
    instances,
    filters: { isArchived: false },
    dates,
    hideNonVisible: true,
  });

  // Assert
  expect(response).toEqual(expectedResponse);
});
