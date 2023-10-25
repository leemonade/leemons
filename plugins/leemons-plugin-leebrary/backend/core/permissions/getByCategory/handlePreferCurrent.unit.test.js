const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handlePreferCurrent } = require('./handlePreferCurrent');

it('Should call handlePreferCurrent correctly', async () => {
  // Arrange
  const assetOne = { name: 'assetOne', id: 'assetOne@1.0.0' };
  const assetTwo = { name: 'assetTwo', id: 'assetTwo@1.0.0' };
  const assetOneUpdated = { name: 'assetOneUpdated', id: 'assetOne@2.0.0' };
  const resultsParam = [
    { asset: assetOne.id, role: 'viewer', permissions: {} },
    { asset: assetTwo.id, role: 'viewer', permissions: {} },
    { asset: assetOneUpdated.id, role: 'viewer', permissions: {} },
  ];

  const parseId = fn().mockImplementation(({ id }) => {
    const [uuid, version] = id.split('@');
    return Promise.resolve({ fullId: id, version, uuid });
  });

  const ctx = generateCtx({
    actions: {
      'common.versionControl.parseId': parseId,
    },
  });

  // Act
  const response = await handlePreferCurrent({ results: resultsParam, ctx });

  // Assert
  expect(response).toEqual([resultsParam[2], resultsParam[1]]);
});
