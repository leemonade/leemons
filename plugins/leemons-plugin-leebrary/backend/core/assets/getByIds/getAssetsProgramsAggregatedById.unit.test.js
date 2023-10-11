const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getAssetsProgramsAggregatedById } = require('./getAssetsProgramsAggregatedById');

it('Should call getAssetsProgramsAggregatedById correctly', async () => {
  // Arrange
  const assets = [
    { id: 'assetOne', program: 'programOneId' },
    { id: 'assetTwo', program: 'programTwoId' },
  ];
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
  const programsByIdsAction = fn(() => [
    { ...mockProgram },
    { ...mockProgram, id: 'programTwoId', name: 'programTwo' },
  ]);

  const ctx = generateCtx({
    actions: {
      'academic-portfolio.programs.programsByIds': programsByIdsAction,
    },
  });
  const expectedValue = {
    [assets[0].program]: mockProgram,
    [assets[1].program]: { ...mockProgram, id: 'programTwoId', name: 'programTwo' },
  };

  // Act
  const response = await getAssetsProgramsAggregatedById({ assets, ctx });

  // Assert
  expect(programsByIdsAction).toBeCalledWith({
    ids: assets.map((asset) => asset.program),
    onlyProgram: true,
  });
  expect(response).toEqual(expectedValue);
});

it('Should return an empty object when assets do not have programs', async () => {
  // Arrange
  const assets = [{ id: 'assetOne' }, { id: 'assetTwo' }];
  const ctx = generateCtx({
    actions: {
      'academic-portfolio.programs.programsByIds': fn(() => []),
    },
  });
  const expectedValue = {};

  // Act
  const response = await getAssetsProgramsAggregatedById({ assets, ctx });

  // Assert
  expect(response).toEqual(expectedValue);
});

it('Should return an empty object when no assets are provided', async () => {
  // Arrange
  const assets = [];
  const ctx = generateCtx({
    actions: {
      'academic-portfolio.programs.programsByIds': fn(() => []),
    },
  });
  const expectedValue = {};

  // Act
  const response = await getAssetsProgramsAggregatedById({ assets, ctx });

  // Assert
  expect(response).toEqual(expectedValue);
});
