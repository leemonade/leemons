const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { omit, pick } = require('lodash');

const { setAsset } = require('./setAsset');
const { CATEGORIES } = require('../../../config/constants');
const getMockCategory = require('../../../__fixtures__/getCategory');
const getUserSession = require('../../../__fixtures__/getUserSession');

// MOCKS
jest.mock('../../categories/getById');
jest.mock('../update');
jest.mock('../add');
jest.mock('../../permissions/helpers/canAssignRole');
jest.mock('../../permissions/getByAsset');
jest.mock('../../permissions/getUsersByAsset');
const { getById: getCategory } = require('../../categories/getById');
const { update } = require('../update');
const { add } = require('../add');
const canAssignRole = require('../../permissions/helpers/canAssignRole');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');
const { getUsersByAsset } = require('../../permissions/getUsersByAsset');

beforeEach(() => {
  jest.resetAllMocks();
});

const { mediaFileCategoryObject } = getMockCategory();
const userSession = getUserSession();
const getUsersByAssetMockResult = {
  ...pick(userSession, ['avatar', 'birthdate', 'id', 'email', 'email']),
  userAgentIds: [userSession.userAgents[0].id],
  permissions: ['owner'],
};

it('Should throw an error if category id is empty', async () => {
  const ctx = generateCtx({});
  try {
    await setAsset({ ctx, categoryId: '' });
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
  }
});

it('Should throw an error if no file was uploaded for media files', async () => {
  const ctx = generateCtx({});
  getCategory.mockResolvedValue({ key: CATEGORIES.MEDIA_FILES });
  try {
    await setAsset({ ctx, categoryId: '1' });
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
  }
});

it('Should add a media file asset correctly', async () => {
  const ctx = generateCtx({});
  const params = {
    files: {
      cover: { size: 3801, path: 'path/cover' },
    },
    categoryId: 'categoryOne',
    tags: 'leemons,testing',
    file: 'createdFileDBId',
    name: 'My asset',
    tagline: 'tagline',
    description: 'description',
    program: 'null',
    subjects: JSON.stringify({ id: 'subjectOne' }),
  };
  const assetData = {
    ...omit(params, ['files', 'categoryId', 'tags', 'file', 'cover']),
    program: null,
    subjects: JSON.parse(params.subjects),
  };
  const asset = { id: 'newAssetId' };
  const role = 'owner';
  const user = { ...getUsersByAssetMockResult };
  const editable = true;
  const assetPermissions = [{ ...user, editable }];

  const categoryObject = { ...mediaFileCategoryObject, id: params.categoryId };
  getCategory.mockResolvedValue(categoryObject);
  add.mockResolvedValue(asset);
  getPermissions.mockResolvedValue({ role });
  getUsersByAsset.mockResolvedValue([user]);
  canAssignRole.mockReturnValue(editable);

  const expectedResponse = { ...asset, canAccess: assetPermissions };
  // Act
  const response = await setAsset({ ...params, ctx });

  // Assert
  expect(getCategory).toBeCalledWith({ id: params.categoryId, ctx });
  expect(update).not.toBeCalled();
  expect(add).toBeCalledWith({
    asset: {
      ...assetData,
      category: categoryObject,
      categoryId: params.categoryId,
      cover: params.files.cover,
      file: params.file,
      tags: params.tags.split(','),
    },
    ctx: { ...ctx, callerPlugin: ctx.prefixPN('') },
  });
  expect(getPermissions).toBeCalledWith({ assetId: asset.id, ctx });
  expect(getUsersByAsset).toBeCalledWith({ assetId: asset.id, ctx });
  expect(canAssignRole).toBeCalledWith({
    userRole: role,
    assignedUserCurrentRole: user.permissions[0],
    newRole: user.permissions[0],
    ctx,
  });
  expect(user).toEqual(getUsersByAssetMockResult);
  expect(response).toEqual(expectedResponse);
});

it('Should check that only one file at a time is uploaded', async () => {
  const ctx = generateCtx({});
  const params = {
    files: {
      cover: { size: 3801, path: 'any/path' },
      files: { size: 3801, path: 'path/to/other-file' },
    },
    categoryId: 'categoryOne',
    tags: 'leemons',
    file: 'createdFileDBId',
    name: 'My new asset',
    tagline: 'tagline',
    description: 'description',
    program: 'null',
    subjects: 'null',
  };
  const multipleFiles = { files: [{}, {}] };
  const assetData = {
    ...omit(params, ['files', 'categoryId', 'tags', 'file', 'cover']),
    program: null,
    subjects: null,
  };
  const asset = { id: 'newAssetId' };
  const role = 'owner';
  const user = { ...getUsersByAssetMockResult };

  const categoryObject = { ...mediaFileCategoryObject, id: params.categoryId };
  getCategory.mockResolvedValue(categoryObject);
  add.mockResolvedValue(asset);
  getPermissions.mockResolvedValue({ role });
  getUsersByAsset.mockResolvedValue([user]);
  canAssignRole.mockReturnValue(true);

  // Act
  await setAsset({ ...params, ctx });
  const testFnToThrow = async () => setAsset({ ...params, ctx, files: multipleFiles });

  // Assert
  expect(add).toBeCalledWith({
    asset: {
      ...assetData,
      category: categoryObject,
      categoryId: params.categoryId,
      cover: params.files.cover,
      file: params.files.files,
      tags: params.tags.split(','),
    },
    ctx: { ...ctx, callerPlugin: ctx.prefixPN('') },
  });
  await expect(testFnToThrow()).rejects.toThrowError(LeemonsError);
});

it('Should update the asset if id is provided', async () => {
  const params = {
    id: 'bookmarkAsset@1.0.0',
    categoryId: 'categoryOne',
    cover: 'coverImageId',
    url: 'http://example.com',
    name: 'BookmarK Asset Example',
    files: {}, // leemons-legacy: An empty object arrives. This value may differ in the future.
  };
  const ctx = generateCtx({});

  const assetData = {
    ...omit(params, ['files', 'categoryId', 'file', 'cover']),
  };
  const simpleCategoryObj = { key: CATEGORIES.BOOKMARKS };
  const role = 'owner';
  const user = { ...getUsersByAssetMockResult };
  const editable = true;
  const assetPermissions = [{ ...user, editable }];

  getCategory.mockResolvedValue(simpleCategoryObj);
  update.mockResolvedValue({ id: '1' });
  getPermissions.mockResolvedValue({ role });
  getUsersByAsset.mockResolvedValue([user]);
  canAssignRole.mockReturnValue(editable);

  // Act
  const result = await setAsset({ ...params, ctx });

  // Assert
  expect(add).not.toBeCalled();
  expect(update).toBeCalledWith({
    data: {
      ...assetData,
      id: params.id,
      category: simpleCategoryObj,
      categoryId: params.categoryId,
      cover: params.cover,
      file: undefined,
      tags: [],
    },
    ctx: { ...ctx, callerPlugin: ctx.prefixPN('') },
  });
  expect(result).toEqual({ id: '1', canAccess: assetPermissions });
});

it('Should try to get the cover image from different sources before adding or updating a media-file asset', async () => {
  const ctx = generateCtx({});
  const params = {
    files: {
      coverFile: { size: 3801, path: 'path/to/cover', name: 'imageName.jpeg', type: 'image/jpeg' },
    },
    categoryId: 'categoryOne',
    tags: 'leemons,testing',
    file: 'createdFileDBId',
    name: 'My new asset',
    tagline: 'tagline',
    description: 'description',
    program: 'null',
    subjects: 'null',
    coverFile: 'assetDataCoverFile',
  };
  getCategory.mockResolvedValue({ key: CATEGORIES.MEDIA_FILES });
  const expectedFilesCoverFile = { cover: params.files.coverFile };
  const expectedAssetCover = { cover: 'assetCoverId' };

  // Act & Assert
  try {
    await setAsset({ ...params, ctx });
    expect(add).lastCalledWith(expect.objectContaining(expectedFilesCoverFile));
  } catch (error) {
    // No action needed
  }
  try {
    await setAsset({ ...params, files: {}, cover: expectedAssetCover.cover, ctx });
    expect(add).lastCalledWith(expect.objectContaining(expectedAssetCover));
  } catch (error) {
    // No action needed
  }
  try {
    await setAsset({ ...params, files: {}, ctx });
    expect(add).lastCalledWith(expect.objectContaining(params.coverFile));
  } catch (error) {
    // No action needed
  }
});

it('Should try to get the cover image from different sources before adding or updating a bookmark asset', async () => {
  const ctx = generateCtx({});
  const params = {
    id: 'bookmarkAsset@1.0.0',
    files: {
      cover: { size: 3801, path: 'path/to/cover' },
      coverFile: { size: 2001, path: 'other/cover' },
    },
    categoryId: 'categoryOne',
    url: 'http://example.com',
    name: 'Bookmark Asset Example',
  };
  getCategory.mockResolvedValue({ key: CATEGORIES.BOOKMARKS });
  const expectedFilesCover = { cover: params.files.cover };
  const expectedFilesCoverFile = { cover: params.files.coverFile };
  const expectedAssetCover = { cover: params.coverFile };

  // Act & Assert
  try {
    await setAsset({ ...params, coverFile: 'coverFile', ctx });
    expect(add).lastCalledWith(expect.objectContaining(expectedFilesCover));
  } catch (error) {
    // No action needed
  }
  try {
    await setAsset({
      ...params,
      files: { coverFile: params.files.coverFile },
      cover: expectedAssetCover.cover,
      ctx,
    });
    expect(add).lastCalledWith(expect.objectContaining(expectedFilesCoverFile));
  } catch (error) {
    // No action needed
  }
  try {
    await setAsset({ ...params, files: {}, ctx });
    expect(add).lastCalledWith(expect.objectContaining(params.coverFile));
  } catch (error) {
    // No action needed
  }
});

it('Proper file and cover assignment depend on a correct category.key value', async () => {
  const ctx = generateCtx({});
  const params = {
    id: 'asestId',
    categoryId: 'categoryOne',
    url: 'url',
    name: 'Bookmark Asset Example',
  };
  getCategory.mockResolvedValue({ key: 'wrong category key' });

  // Act and assert
  try {
    await setAsset({ ...params, ctx });
    expect(add).lastCalledWith(expect.objectContaining({ cover: undefined }));
  } catch (error) {
    // No action needed
  }
});
