const { describe, it, beforeAll, beforeEach, expect } = require('@jest/globals');
const { map } = require('lodash');

const { generateCtx } = require('@leemons/testing');
const { getAssets } = require('./getAssets');

jest.mock('../../files/getAssetsByType');
const { getAssetsByType } = require('../../files/getAssetsByType');

jest.mock('../../assets/getAssetsByProgram');
const { getAssetsByProgram } = require('../../assets/getAssetsByProgram');

jest.mock('../../assets/getAssetsBySubject');
const { getAssetsBySubject } = require('../../assets/getAssetsBySubject');

jest.mock('../../assets/getIndexables');
const { getIndexables } = require('../../assets/getIndexables');

const getProfileSysNameHandler = jest.fn();

describe('getAssets', () => {
  let ctx;
  let assets;
  let indexable;
  let nothingFound;
  let onlyShared;
  let programs;
  let subjects;
  let type;

  beforeAll(() => {
    ctx = generateCtx({
      actions: {
        'users.profiles.getProfileSysName': getProfileSysNameHandler,
      },
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();

    assets = ['assetId1', 'assetId2', 'assetId3'];

    indexable = true;
    nothingFound = false;
    onlyShared = false;
    programs = ['program1', 'program2'];
    subjects = ['subject2', 'subject3'];
    type = 'testType';
  });

  describe('Intended workload', () => {
    it('Should correctly fetch assets based on the provided criteria', async () => {
      // Arrange
      getAssetsByType.mockReturnValue(assets);
      getAssetsByProgram.mockReturnValue([assets[0], assets[1]]);
      getAssetsBySubject.mockReturnValue([assets[1]]);
      getIndexables.mockReturnValue([{ id: assets[1] }]);

      const expectedAssets = ['assetId2'];

      // Act
      const result = await getAssets({
        assets,
        indexable,
        nothingFound,
        onlyShared,
        programs,
        subjects,
        type,
        ctx,
      });

      // Assert
      expect(getAssetsByType).toBeCalledWith({ type, assets, ctx });
      expect(getAssetsByProgram).toBeCalledWith({
        program: programs,
        assets,
        ctx,
      });
      expect(getAssetsBySubject).toBeCalledWith({
        subject: subjects,
        assets: [assets[0], assets[1]],
        ctx,
      });
      expect(getIndexables).toBeCalledWith({ assetIds: [assets[1]], columns: ['id'], ctx });
      expect(result.assets).toEqual(expectedAssets);
      expect(result.nothingFound).toEqual(false);
      expect(getAssetsBySubject).toBeCalledTimes(1);
    });
  });

  describe('Limit use cases', () => {
    it('Should return original assets if no type programs & subjects are provided', async () => {
      // Arrange
      type = undefined;
      programs = undefined;
      subjects = undefined;

      getAssetsByType.mockReturnValue(assets);
      getIndexables.mockReturnValue(map(assets, (id) => ({ id })));

      const expectedAssets = assets;

      // Act
      const result = await getAssets({
        assets,
        indexable,
        nothingFound,
        onlyShared,
        programs,
        subjects,
        type,
        ctx,
      });

      // Assert
      expect(getAssetsByType).not.toBeCalled();
      expect(getAssetsByProgram).not.toBeCalled();
      expect(getAssetsBySubject).not.toBeCalled();
      expect(getIndexables).toBeCalledWith({ assetIds: assets, columns: ['id'], ctx });
      expect(result.assets).toEqual(expectedAssets);
      expect(result.nothingFound).toEqual(false);
      expect(getAssetsBySubject).toBeCalledTimes(0);
    });
    it('Should return nothingFound as true if no assets match the criteria', async () => {
      getAssetsByType.mockReturnValue([]);
      getAssetsByProgram.mockReturnValue([]);
      getAssetsBySubject.mockReturnValue([]);
      getIndexables.mockReturnValue([]);

      const expectedAssets = [];

      // Act
      const result = await getAssets({
        assets,
        indexable,
        nothingFound,
        onlyShared,
        programs,
        subjects,
        type,
        ctx,
      });

      // Assert
      expect(getAssetsByType).toBeCalledWith({ type, assets, ctx });
      expect(getAssetsByProgram).toBeCalledWith({
        program: programs,
        assets: [],
        ctx,
      });
      expect(getAssetsBySubject).toBeCalledWith({
        subject: subjects,
        assets: [],
        ctx,
      });
      expect(getIndexables).not.toBeCalled();
      expect(result.assets).toEqual(expectedAssets);
      expect(result.nothingFound).toEqual(true);
      expect(getAssetsBySubject).toBeCalledTimes(1);
    });

    it('Should return only shared assets if onlyShared is true', async () => {
      // Arrange
      onlyShared = true;
      getProfileSysNameHandler.mockReturnValue('student');
      getAssetsBySubject.mockReturnValue([]);

      // Act
      const result = await getAssets({
        assets,
        indexable,
        nothingFound,
        onlyShared,
        programs,
        subjects,
        type,
        ctx,
      });

      // Assert
      expect(getAssetsBySubject).toBeCalledWith({
        subject: [],
        assets,
        ctx,
      });
      expect(result.assets).toEqual(assets);
      expect(result.nothingFound).toEqual(nothingFound);
    });
  });

  describe('Error handling', () => {
    it('Should throw an error if assets is not provided', async () => {
      // Arrange
      assets = undefined;

      // Act
      const testFunc = async () =>
        getAssets({
          assets,
          indexable,
          nothingFound,
          onlyShared,
          programs,
          subjects,
          type,
          ctx,
        });

      // Assert
      await expect(testFunc).rejects.toThrow(
        "Cannot read properties of undefined (reading 'length')"
      );
    });
  });

  describe('Additional tests', () => {
    it('Should return nothingFound as true if assets is an empty array and onlyShared is false', async () => {
      // Arrange
      assets = [];
      onlyShared = false;
      getAssetsByType.mockReturnValue([]);
      getAssetsByProgram.mockReturnValue([]);
      getAssetsBySubject.mockReturnValue([]);

      // Act
      const result = await getAssets({
        assets,
        indexable,
        nothingFound,
        onlyShared,
        programs,
        subjects,
        type,
        ctx,
      });

      // Assert
      expect(getIndexables).not.toBeCalled();
      expect(result.assets).toEqual([]);
      expect(result.nothingFound).toEqual(true);
    });

    it('Should return nothingFound as false if assets is an empty array and onlyShared is true', async () => {
      // Arrange
      assets = [];
      onlyShared = true;

      // Act
      const result = await getAssets({
        assets,
        indexable,
        nothingFound,
        onlyShared,
        programs,
        subjects,
        type,
        ctx,
      });

      // Assert
      expect(result.assets).toEqual([]);
      expect(result.nothingFound).toEqual(false);
    });
  });
});
