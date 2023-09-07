const { it, expect } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { getFilesToDuplicate } = require('./getFilesToDuplicate');
const getBookmarkFromDB = require('../../../__fixtures__/getBookmarkFromDB');
const getAssets = require('../../../__fixtures__/getAssets');

// Mocks
jest.mock('../../files/getByIds');
const { getByIds: getFiles } = require('../../files/getByIds');

const { bookmarkAsset } = getAssets();
const bookmark = getBookmarkFromDB();

it('Should retrieve files using their IDs and find the cover file among them', async () => {
  // Arrange
  const filesIds = [bookmarkAsset.cover.id, bookmark.icon];
  const mockFilesToDuplicate = [
    {
      id: bookmarkAsset.cover.id,
      provider: 'leebrary-aws-s3',
      type: 'image/png',
      extension: 'png',
      name: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
      size: 90101,
      uri: 'leemons/leebrary/1f9be389-ab82-46e4-9acf-5010326995e2.png',
      isFolder: null,
      metadata: '{"size":"88.0 KB","format":"PNG","width":"1024","height":"538"}',
      deleted: 0,
      created_at: '2023-09-04T12:35:15.000Z',
      updated_at: '2023-09-04T12:35:16.000Z',
      deleted_at: null,
    },
    {
      id: 'e42f215d-a3f1-4281-957d-409555b12b39',
      provider: 'leebrary-aws-s3',
      type: 'image/png',
      extension: 'png',
      name: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
      size: 459,
      uri: 'leemons/leebrary/e42f215d-a3f1-4281-957d-409555b12b39.png',
      isFolder: null,
      metadata: '{"size":"459 B","format":"PNG","width":"32","height":"32"}',
      deleted: 0,
      created_at: '2023-09-04T12:35:16.000Z',
      updated_at: '2023-09-04T12:35:17.000Z',
      deleted_at: null,
    },
  ];
  const ctx = generateCtx({});
  getFiles.mockResolvedValue(mockFilesToDuplicate);

  const expectedResult = { filesToDuplicate: mockFilesToDuplicate, cover: mockFilesToDuplicate[0] };

  // Act
  const response = await getFilesToDuplicate({ filesIds, coverId: bookmarkAsset.cover.id, ctx });

  // Assert
  expect(getFiles).toBeCalledWith({ filesIds, parsed: false, ctx });
  expect(response).toEqual(expectedResult);
});
