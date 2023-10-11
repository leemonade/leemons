const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getAssetsTags } = require('./getAssetsTags');

it('Should call the tags service correctly and return its return value', async () => {
  // Arrange
  const assets = [{ id: 'assetOne' }, { id: 'assetTwo' }];
  const expectedResponse = [['tagOne'], ['tagTwo']];
  let timesCalled = 0;
  const getValuesTagsAction = fn(() => {
    timesCalled++;
    if (timesCalled === 1) {
      return Promise.resolve(expectedResponse[0]);
    }
    return Promise.resolve(expectedResponse[1]);
  });

  const ctx = generateCtx({
    actions: {
      'common.tags.getValuesTags': getValuesTagsAction,
    },
  });

  // Act
  const response = await getAssetsTags({ assets, ctx });

  // Assert
  expect(getValuesTagsAction).nthCalledWith(1, {
    type: ctx.prefixPN(''),
    values: assets[0].id,
  });
  expect(getValuesTagsAction).nthCalledWith(2, {
    type: ctx.prefixPN(''),
    values: assets[1].id,
  });
  expect(response).toEqual(expectedResponse);
});
