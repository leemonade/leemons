const { it, expect } = require('@jest/globals');

const { processFinalAsset } = require('./processFinalAsset');
const getAssets = require('../../../__fixtures__/getAssets');
const getCategory = require('../../../__fixtures__/getCategory');
const { CATEGORIES } = require('../../../config/constants');

const { assetModel } = getAssets();
const mockProgram = {
  id: 'programOneId',
  name: 'programOne',
  abbreviation: 'p1',
  credits: null,
  maxGroupAbbreviation: 9,
  maxGroupAbbreviationIsOnlyNumbers: true,
  maxNumberOfCourses: 0,
  courseCredits: 0,
  hideCoursesInTree: false,
  moreThanOneAcademicYear: false,
  numberOfSubstages: 1,
  subjectsFirstDigit: 'a',
  subjectsDigits: 1,
};
const assetOne = {
  ...assetModel,
  id: 'assetOneId',
  name: 'assetOne',
  program: mockProgram.id,
  canAccess: [
    {
      id: 'userId1',
      email: 'user1@example.com',
      name: 'User1',
      surnames: 'Surname1',
      secondSurname: 'SecondSurname1',
      birthdate: '1990-01-01',
      avatar: 'avatar1.png',
      gender: 'male',
      userAgentIds: ['userAgentOne'],
      permissions: ['owner'],
      editable: true,
    },
  ],
};
const assetTwo = {
  ...assetModel,
  id: 'assetTwoId',
  name: 'assetTwo',
  program: mockProgram.id,
  canAccess: [
    {
      id: 'userId1',
      email: 'user1@example.com',
      name: 'User1',
      surnames: 'Surname1',
      secondSurname: 'SecondSurname1',
      birthdate: '1990-01-01',
      avatar: 'avatar1.png',
      gender: 'male',
      userAgentIds: ['userAgentOne'],
      permissions: ['editor'],
      editable: true,
    },
  ],
};
const { categoryObject: mockCategory } = getCategory();
const mockTags = [['Leemons'], []];

it('should process the final asset with additional properties', () => {
  const programsById = {
    [mockProgram.id]: mockProgram,
  };
  const permissionsByAsset = {
    [assetOne.id]: {
      viewer: [],
      editor: [],
    },
  };
  const canEditPermissions = [assetOne.id];
  const withCategory = true;
  const categories = [mockCategory];
  const assetCategoryData = [{ asset: assetOne.id }];
  const withTags = true;
  const tags = mockTags;
  const checkPins = true;
  const pins = [];
  const userAgents = ['userAgentOne'];

  const processedAsset = processFinalAsset({
    asset: assetOne,
    programsById,
    permissionsByAsset,
    canEditPermissions,
    withCategory,
    categories,
    assetCategoryData,
    withTags,
    tags,
    checkPins,
    pins,
    userAgents,
  });

  expect(processedAsset).toEqual({
    ...assetOne,
    programName: mockProgram.name,
    permissions: permissionsByAsset[assetOne.id],
    duplicable: mockCategory.duplicable,
    downloadable: mockCategory.key === CATEGORIES.MEDIA_FILES,
    providerData: assetCategoryData[0],
    tags: mockTags[0],
    pinned: false,
    editable: true,
    deleteable: true,
    shareable: true,
    assignable: true,
    role: 'owner',
  });
});

it('should process the final asset with all flags set to false', () => {
  const programsById = {
    [mockProgram.id]: mockProgram,
  };
  const permissionsByAsset = {
    [assetTwo.id]: {
      viewer: [],
      editor: [],
    },
  };
  const canEditPermissions = [assetTwo.id];
  const withCategory = false;
  const categories = [];
  const assetCategoryData = [];
  const withTags = false;
  const tags = [];
  const checkPins = false;
  const pins = [];
  const userAgents = ['userAgentOne'];

  const processedAsset = processFinalAsset({
    asset: assetTwo,
    programsById,
    permissionsByAsset,
    canEditPermissions,
    withCategory,
    categories,
    assetCategoryData,
    withTags,
    tags,
    checkPins,
    pins,
    userAgents,
  });

  expect(processedAsset).toEqual({
    ...assetTwo,
    programName: mockProgram.name,
    permissions: permissionsByAsset[assetTwo.id],
    editable: true,
    deleteable: false,
    shareable: true,
    role: 'editor',
    assignable: true,
  });
});

it('should process an asset without canAccess, permissionsByAsset and canEditPermissions', () => {
  const assetThree = {
    ...assetModel,
    id: 'assetThreeId',
    name: 'assetThree',
    canAccess: null,
  };
  const programsById = {
    [mockProgram.id]: mockProgram,
  };
  const permissionsByAsset = {};
  const canEditPermissions = [];
  const withCategory = false;
  const categories = [];
  const assetCategoryData = [];
  const withTags = false;
  const tags = [];
  const checkPins = false;
  const pins = [];
  const userAgents = ['userAgentOne'];

  const processedAsset = processFinalAsset({
    asset: assetThree,
    programsById,
    permissionsByAsset,
    canEditPermissions,
    withCategory,
    categories,
    assetCategoryData,
    withTags,
    tags,
    checkPins,
    pins,
    userAgents,
  });

  expect(processedAsset).toEqual({
    ...assetThree,
    permissions: { viewer: [], editor: [] },
  });
});
