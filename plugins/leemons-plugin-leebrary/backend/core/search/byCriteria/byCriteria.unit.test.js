const { it, expect, beforeAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { byCriteria } = require('./byCriteria');

jest.mock('./getCategoryId');
const { getCategoryId } = require('./getCategoryId');

jest.mock('./getPinnedAssets');
const { getPinnedAssets } = require('./getPinnedAssets');

jest.mock('./getProviderAssets');
const { getProviderAssets } = require('./getProviderAssets');

jest.mock('./getAssets');
const { getAssets } = require('./getAssets');

jest.mock('./getAssetsWithPermissions');
const { getAssetsWithPermissions } = require('./getAssetsWithPermissions');

jest.mock('./sortAssets');
const { sortAssets } = require('./sortAssets');

describe('byCriteria', () => {
  let ctx;
  let assets;
  let permissionAssets;
  let params;

  beforeAll(async () => {
    ctx = generateCtx({});
    assets = [
      '0b4635b5-d4ed-4c47-8cbe-7ed551d8eac1@1.0.0',
      '55c84a20-94e9-40ca-8afa-94aa675bb625@1.0.0',
      'a49b8df7-f06c-408e-bbca-5fbce6a33cfc@1.0.0',
      'edbbc5f1-98e8-42bc-a01c-f523f44d047d@1.0.0',
    ];
    permissionAssets = [
      {
        asset: 'a49b8df7-f06c-408e-bbca-5fbce6a33cfc@1.0.0',
        role: 'owner',
        permissions: {
          view: true,
          assign: true,
          comment: true,
          edit: true,
          delete: true,
          duplicate: true,
          canAssign: ['assigner', 'viewer', 'commentor', 'editor', 'owner'],
          canUnassign: ['assigner', 'viewer', 'commentor', 'editor'],
        },
      },
      {
        asset: '55c84a20-94e9-40ca-8afa-94aa675bb625@1.0.0',
        role: 'owner',
        permissions: {
          view: true,
          assign: true,
          comment: true,
          edit: true,
          delete: true,
          duplicate: true,
          canAssign: ['assigner', 'viewer', 'commentor', 'editor', 'owner'],
          canUnassign: ['assigner', 'viewer', 'commentor', 'editor'],
        },
      },
    ];
  });

  beforeEach(async () => {
    jest.resetAllMocks();

    params = {
      criteria: 'projects',
      type: 'type1',
      category: '1ac55ed0-9d52-43b6-922c-9e2542cac347',
      allVersions: false,
      sortBy: 'updated_at',
      sortDirection: 'desc',
      published: true,
      indexable: true,
      preferCurrent: 'true',
      searchInProvider: false,
      providerQuery: { program: null },
      pinned: undefined,
      showPublic: false,
      roles: [],
      onlyShared: false,
      programs: null,
      subjects: null,
      ctx,
    };
  });

  describe('Intended workload', () => {
    it('should return sorted assets based on the provided criteria', async () => {
      // Arrange
      getCategoryId.mockResolvedValue(params.category);
      getPinnedAssets.mockResolvedValue({ assets: [], nothingFound: false });
      getProviderAssets.mockResolvedValue({ assets, nothingFound: false });
      getAssets.mockResolvedValue({ assets, nothingFound: false });
      getAssetsWithPermissions.mockResolvedValue(permissionAssets);
      sortAssets.mockResolvedValue(permissionAssets);

      // Act
      const result = await byCriteria(params);

      // Assert
      expect(getCategoryId).toBeCalledWith({ category: params.category, ctx });
      expect(getProviderAssets).toBeCalledWith({
        assets: [],
        categoryId: params.category,
        criteria: params.criteria,
        indexable: params.indexable,
        nothingFound: false,
        pinned: params.pinned,
        preferCurrent: params.preferCurrent,
        providerQuery: params.providerQuery,
        published: params.published,
        searchInProvider: params.searchInProvider,
        ctx,
      });
      expect(getAssets).toBeCalledWith({
        assets,
        indexable: params.indexable,
        nothingFound: false,
        onlyShared: params.onlyShared,
        programs: params.programs,
        subjects: params.subjects,
        type: params.type,
        ctx,
      });
      expect(getAssetsWithPermissions).toBeCalledWith({
        assets,
        nothingFound: false,
        onlyShared: params.onlyShared,
        preferCurrent: params.preferCurrent,
        published: params.published,
        roles: params.roles,
        showPublic: params.showPublic,
        ctx,
      });
      expect(sortAssets).toBeCalledWith({
        assets: permissionAssets,
        indexable: params.indexable,
        showPublic: params.showPublic,
        sortDirection: params.sortDirection,
        sortingBy: params.sortBy,
        ctx,
      });
      expect(result).toEqual(permissionAssets);
    });
  });

  describe('Limit use cases', () => {
    it('should return sorted assets based on the provided criteria using default params', async () => {
      // Arrange
      getCategoryId.mockResolvedValue(params.category);
      getPinnedAssets.mockResolvedValue({ assets: [], nothingFound: false });
      getProviderAssets.mockResolvedValue({ assets, nothingFound: false });
      getAssets.mockResolvedValue({ assets, nothingFound: false });

      params.criteria = undefined;
      params.sortDirection = undefined;
      params.published = undefined;
      params.indexable = undefined;
      params.providerQuery = undefined;
      const defaultParams = {
        criteria: '',
        sortDirection: 'asc',
        published: true,
        indexable: true,
        providerQuery: {},
      };

      // Act
      await byCriteria(params);

      // Assert

      expect(getProviderAssets).toBeCalledWith({
        assets: [],
        categoryId: params.category,
        criteria: defaultParams.criteria,
        indexable: defaultParams.indexable,
        nothingFound: false,
        pinned: params.pinned,
        preferCurrent: params.preferCurrent,
        providerQuery: defaultParams.providerQuery,
        published: defaultParams.published,
        searchInProvider: params.searchInProvider,
        ctx,
      });
      expect(getAssets).toBeCalledWith({
        assets,
        indexable: defaultParams.indexable,
        nothingFound: false,
        onlyShared: params.onlyShared,
        programs: params.programs,
        subjects: params.subjects,
        type: params.type,
        ctx,
      });
    });

    it('should return sorted assets based on the provided criteria using default params #2', async () => {
      // Arrange
      getCategoryId.mockResolvedValue(params.category);
      getPinnedAssets.mockResolvedValue({ assets: [], nothingFound: false });
      getProviderAssets.mockResolvedValue({ assets, nothingFound: false });
      getAssets.mockResolvedValue({ assets, nothingFound: false });

      params.criteria = undefined;
      params.sortDirection = undefined;
      params.published = undefined;
      params.indexable = undefined;
      params.providerQuery = 'not-an-object';
      params.programs = ['program1'];
      params.subjects = ['subject1'];
      const defaultParams = {
        criteria: '',
        sortDirection: 'asc',
        published: true,
        indexable: true,
        providerQuery: { program: 'program1', subjects: ['subject1'] },
      };

      // Act
      await byCriteria(params);

      // Assert
      expect(getProviderAssets).toBeCalledWith({
        assets: [],
        categoryId: params.category,
        criteria: defaultParams.criteria,
        indexable: defaultParams.indexable,
        nothingFound: false,
        pinned: params.pinned,
        preferCurrent: params.preferCurrent,
        providerQuery: defaultParams.providerQuery,
        published: defaultParams.published,
        searchInProvider: params.searchInProvider,
        ctx,
      });
      expect(getAssets).toBeCalledWith({
        assets,
        indexable: defaultParams.indexable,
        nothingFound: false,
        onlyShared: params.onlyShared,
        programs: params.programs,
        subjects: params.subjects,
        type: params.type,
        ctx,
      });
    });
    it('should return sorted assets based on the provided criteria using default params #3', async () => {
      // Arrange
      getCategoryId.mockResolvedValue(params.category);
      getPinnedAssets.mockResolvedValue({ assets: [], nothingFound: false });
      getProviderAssets.mockResolvedValue({ assets, nothingFound: false });
      getAssets.mockResolvedValue({ assets, nothingFound: false });

      params.criteria = undefined;
      params.sortDirection = undefined;
      params.published = undefined;
      params.indexable = undefined;
      params.providerQuery = { program: 'program1', subjects: ['subject1'] };
      params.pinned = true;

      const defaultParams = {
        criteria: '',
        sortDirection: 'asc',
        published: 'all',
        preferCurrent: false,
        indexable: true,
        programs: ['program1'],
        subjects: ['subject1'],
      };

      // Act
      await byCriteria(params);

      // Assert
      expect(getProviderAssets).toBeCalledWith({
        assets: [],
        categoryId: params.category,
        criteria: defaultParams.criteria,
        indexable: defaultParams.indexable,
        nothingFound: false,
        pinned: params.pinned,
        preferCurrent: defaultParams.preferCurrent,
        providerQuery: params.providerQuery,
        published: defaultParams.published,
        searchInProvider: params.searchInProvider,
        ctx,
      });
      expect(getAssets).toBeCalledWith({
        assets,
        indexable: defaultParams.indexable,
        nothingFound: false,
        onlyShared: params.onlyShared,
        programs: defaultParams.programs,
        subjects: defaultParams.subjects,
        type: params.type,
        ctx,
      });
    });

    it('should return empty array if no assets found', async () => {
      // Arrange
      getCategoryId.mockResolvedValue('categoryId');
      getPinnedAssets.mockResolvedValue({ assets: [], nothingFound: true });
      getProviderAssets.mockResolvedValue({ assets: [], nothingFound: true });
      getAssets.mockResolvedValue({ assets: [], nothingFound: true });
      getAssetsWithPermissions.mockResolvedValue([]);
      sortAssets.mockResolvedValue([]);

      // Act
      const result = await byCriteria(params);

      // Assert

      expect(result).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should throw an error if any of the functions fails', async () => {
      // Arrange
      const errorMessage = 'error message';
      getCategoryId.mockRejectedValue(new Error(errorMessage));

      // Act
      const testFunc = async () => byCriteria(params);

      // Assert
      await expect(testFunc).rejects.toThrow(LeemonsError, errorMessage);
    });
  });
});
