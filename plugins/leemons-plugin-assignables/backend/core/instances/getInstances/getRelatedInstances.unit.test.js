const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { getRelatedInstances } = require('./getRelatedInstances');
const { getInstances } = require('./getInstances');

jest.mock('./getInstances');

it('Should get related instances', async () => {
  // Arrange
  const ctx = generateCtx({});
  const instances = [
    {
      id: 'instanceId1',
      relatedAssignableInstances: {
        before: [{ id: 'beforeId1' }, { id: 'instanceId2' }],
        after: [{ id: 'afterId1' }],
      },
    },
    {
      id: 'instanceId2',
      relatedAssignableInstances: {
        before: [{ id: 'beforeId2' }, { id: 'instanceId1' }],
        after: [{ id: 'afterId2' }],
      },
    },
  ];
  const details = true;

  const relatedInstances = [
    { id: 'beforeId1' },
    { id: 'afterId1' },
    { id: 'beforeId2' },
    { id: 'afterId2' },
  ];

  getInstances.mockReturnValue(relatedInstances);

  // Act
  const response = await getRelatedInstances({ instances, details, ctx });

  // Assert
  expect(getInstances).toBeCalledWith({
    ids: ['beforeId1', 'afterId1', 'beforeId2', 'afterId2'],
    relatedAssignableInstances: false,
    details,
    ctx,
  });

  expect(response).toEqual({
    instanceId1: {
      before: [
        { id: 'beforeId1', instance: { id: 'beforeId1' } },
        {
          id: 'instanceId2',
          instance: {
            id: 'instanceId2',
            relatedAssignableInstances: {
              before: [{ id: 'beforeId2' }, { id: 'instanceId1' }],
              after: [{ id: 'afterId2' }],
            },
          },
        },
      ],
      after: [{ id: 'afterId1', instance: { id: 'afterId1' } }],
    },
    instanceId2: {
      before: [
        { id: 'beforeId2', instance: { id: 'beforeId2' } },
        {
          id: 'instanceId1',
          instance: {
            id: 'instanceId1',
            relatedAssignableInstances: {
              before: [{ id: 'beforeId1' }, { id: 'instanceId2' }],
              after: [{ id: 'afterId1' }],
            },
          },
        },
      ],
      after: [{ id: 'afterId2', instance: { id: 'afterId2' } }],
    },
  });
});

it('Should return empty object if no related instances', async () => {
  // Arrange
  const ctx = generateCtx({});
  const instances = [
    {
      id: 'instanceId1',
      relatedAssignableInstances: {
        before: [],
        after: [],
      },
    },
    {
      id: 'instanceId2',
      relatedAssignableInstances: {
        before: [],
        after: [],
      },
    },
  ];
  const details = {};

  getInstances.mockReturnValue(instances);

  // Act
  const response = await getRelatedInstances({ instances, details, ctx });

  // Assert
  expect(response).toEqual({
    instanceId1: { before: [], after: [] },
    instanceId2: { before: [], after: [] },
  });
});
