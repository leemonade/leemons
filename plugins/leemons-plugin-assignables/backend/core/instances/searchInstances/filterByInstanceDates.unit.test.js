const { beforeEach, describe, test, expect } = require('@jest/globals');
const dayjs = require('dayjs');

const { generateCtx } = require('@leemons/testing');

const { filterByInstanceDates } = require('./filterByInstanceDates');

const { getInstanceDates } = require('./getInstanceDates');

jest.mock('./getInstanceDates');

const dateAfterNow = dayjs().add(1, 'd').toString();
const dateBeforeNow = dayjs().subtract(1, 'd').toString();
const someDate = dayjs().toString();

let ctx;

beforeEach(async () => {
  jest.resetAllMocks();
  ctx = generateCtx({});
});

describe('should filter instances by deadline', () => {
  test('when query.deadline is true', async () => {
    // Arrange
    getInstanceDates.mockResolvedValue({
      instanceId1: {
        start: someDate,
        closed: someDate,
        archived: someDate,
        visualization: someDate,
        deadline: dateAfterNow,
      },
      instanceId2: {
        start: someDate,
        closed: someDate,
        archived: someDate,
        visualization: someDate,
        deadline: dateBeforeNow,
      },
    });
    const mockParams = {
      query: { deadline: true },
      assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
      ctx,
    };

    // Act
    const resp = await filterByInstanceDates(mockParams);

    // Assert
    expect(resp).toEqual(['instanceId2', 'instanceId3']);
  });

  test('when query.deadline is false', async () => {
    // Arrange
    getInstanceDates.mockResolvedValue({
      instanceId1: {
        start: someDate,
        closed: someDate,
        archived: someDate,
        visualization: someDate,
        deadline: dateAfterNow,
      },
      instanceId2: {
        start: someDate,
        closed: someDate,
        archived: someDate,
        visualization: someDate,
        deadline: dateBeforeNow,
      },
    });
    const mockParams = {
      query: { deadline: false },
      assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
      ctx,
    };

    // Act
    const resp = await filterByInstanceDates(mockParams);

    // Assert
    expect(resp).toEqual(['instanceId1', 'instanceId3']);
  });
  describe('should filter instances by deadline', () => {
    test('when query.closed is true', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: someDate,
          closed: dateAfterNow,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
        instanceId2: {
          start: someDate,
          closed: dateBeforeNow,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
      });
      const mockParams = {
        query: { closed: true },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId2', 'instanceId3']);
    });

    test('when query.closed is false', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: someDate,
          closed: dateAfterNow,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
        instanceId2: {
          start: someDate,
          closed: dateBeforeNow,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
      });
      const mockParams = {
        query: { closed: false },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId1', 'instanceId3']);
    });
  });
  describe('should filter instances by opened', () => {
    test('when query.opened is true', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: dateAfterNow,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
        instanceId2: {
          start: dateBeforeNow,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
      });
      const mockParams = {
        query: { opened: true },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId2', 'instanceId3']);
    });

    test('when query.opened is false', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: dateAfterNow,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
        instanceId2: {
          start: dateBeforeNow,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
      });
      const mockParams = {
        query: { opened: false },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId1', 'instanceId3']);
    });
  });

  describe('should filter instances by archived', () => {
    test('when query.archived is true', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: someDate,
          closed: someDate,
          archived: dateAfterNow,
          visualization: someDate,
          deadline: someDate,
        },
        instanceId2: {
          start: someDate,
          closed: someDate,
          archived: dateBeforeNow,
          visualization: someDate,
          deadline: someDate,
        },
      });

      const mockParams = {
        query: { archived: true },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId2']);
    });

    test('when query.archived is false', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: someDate,
          closed: someDate,
          archived: dateAfterNow,
          visualization: someDate,
          deadline: someDate,
        },
        instanceId2: {
          start: someDate,
          closed: someDate,
          archived: dateBeforeNow,
          visualization: someDate,
          deadline: someDate,
        },
      });

      const mockParams = {
        query: { archived: false },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId1', 'instanceId3']);
    });
  });

  describe('should filter instances by finished', () => {
    test('when query.finished is true and finished_$gt and finished_$lt are valid dates', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: someDate,
          closed: dayjs(dateBeforeNow).subtract(1, 'd').toString(),
          archived: someDate,
          visualization: someDate,
          deadline: dateBeforeNow,
        },
        instanceId2: {
          start: someDate,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
      });

      const mockParams = {
        query: {
          finished: true,
          finished_$gt: dateBeforeNow,
          finished_$lt: dateAfterNow,
        },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId2']);
    });

    test('when query.finished is true and finished_$gt and finished_$lt are not valid dates', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: someDate,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
        instanceId2: {
          start: someDate,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
      });
      const mockParams = {
        query: {
          finished: true,
          finished_$gt: undefined,
          finished_$lt: undefined,
        },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId1', 'instanceId2']);
    });

    test('when query.finished is false', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: someDate,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
        instanceId2: {
          start: someDate,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
      });

      const mockParams = {
        query: { finished: false },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId1', 'instanceId2', 'instanceId3']);
    });
  });

  describe('should filter instances by visibility', () => {
    test('when query.visible is true and instance visualization is after now', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: someDate,
          closed: someDate,
          archived: someDate,
          visualization: dateAfterNow,
          deadline: someDate,
        },
        instanceId2: {
          start: dateBeforeNow,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
      });
      const mockParams = {
        query: { visible: true },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId2', 'instanceId3']);
    });

    test('when query.visible is true and instance is not started', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: dateAfterNow,
          closed: someDate,
          archived: someDate,
          visualization: undefined,
          deadline: someDate,
        },
        instanceId2: {
          start: dateBeforeNow,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
      });
      const mockParams = {
        query: { visible: true },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId2', 'instanceId3']);
    });
    test('when query.visible is false and instance visualization is after now', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: dateAfterNow,
          closed: someDate,
          archived: someDate,
          visualization: dateAfterNow,
          deadline: someDate,
        },
        instanceId2: {
          start: dateAfterNow,
          closed: someDate,
          archived: someDate,
          visualization: dateBeforeNow,
          deadline: someDate,
        },
      });
      const mockParams = {
        query: { visible: false },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId1', 'instanceId3']);
    });

    test('when query.visible is false and instance is not started', async () => {
      // Arrange
      getInstanceDates.mockResolvedValue({
        instanceId1: {
          start: dateAfterNow,
          closed: someDate,
          archived: someDate,
          visualization: undefined,
          deadline: someDate,
        },
        instanceId2: {
          start: dateBeforeNow,
          closed: someDate,
          archived: someDate,
          visualization: someDate,
          deadline: someDate,
        },
      });
      const mockParams = {
        query: { visible: false },
        assignableInstancesIds: ['instanceId1', 'instanceId2', 'instanceId3'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId1', 'instanceId3']);
    });
  });

  describe('should return the same instances if no date filters are provided', () => {
    test.skip('should return the same instances if no date filters are provided', async () => {
      // Arrange
      const mockParams = {
        query: {},
        assignableInstancesIds: ['instanceId1', 'instanceId2'],
        ctx,
      };

      // Act
      const resp = await filterByInstanceDates(mockParams);

      // Assert
      expect(resp).toEqual(['instanceId1', 'instanceId2']);
    });
  });
});
