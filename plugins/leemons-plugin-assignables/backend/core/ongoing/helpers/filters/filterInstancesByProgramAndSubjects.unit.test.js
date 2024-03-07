const { it, expect } = require('@jest/globals');

const { filterInstancesByProgramAndSubjects } = require('./filterInstancesByProgramAndSubjects');

const instanceOne = {
  id: 'instanceOne',
  assignable: {
    asset: { name: 'assetOne' },
    id: 'assignableOneId',
    role: 'task',
  },
};
const instanceTwo = {
  id: 'instanceTwo',
  assignable: {
    asset: { name: 'assetTwo' },
    id: 'assignableTwoId',
    role: 'learningpaths.module',
  },
};
const instanceSubjectsProgramsAndClasses = {
  [instanceOne.id]: {
    subjects: ['subjectOneId'],
    programs: ['programA'],
    classes: ['classOne'],
  },
  [instanceTwo.id]: {
    subjects: ['subjectTwoId'],
    programs: ['programB'],
    classes: ['classTwoId', 'classThreeId'],
  },
};

it('Should correctly filter instances by programs parsing data if needed', () => {
  // Arrange
  const instances = [instanceOne, instanceTwo];

  const filters = {
    programs: instanceSubjectsProgramsAndClasses[instanceTwo.id].programs,
  };

  const expectedResponse = [instanceTwo];

  // Act
  const response = filterInstancesByProgramAndSubjects({
    instances,
    filters,
    instanceSubjectsProgramsAndClasses,
  });
  const notFoundResponse = filterInstancesByProgramAndSubjects({
    instances,
    filters: { programs: ['notFoundProgram'] },
    instanceSubjectsProgramsAndClasses,
  });

  // Assert
  expect(response).toEqual(expectedResponse);
  expect(notFoundResponse).toEqual([]);
});

it('Should correctly filter instances by subjects parsing data if needed', () => {
  // Arrange
  const instances = [instanceOne, instanceTwo];
  const filters = {
    subjects: instanceSubjectsProgramsAndClasses[instanceTwo.id].subjects,
  };

  const expectedResponse = [instanceTwo];

  // Act
  const response = filterInstancesByProgramAndSubjects({
    instances,
    filters,
    instanceSubjectsProgramsAndClasses,
  });
  const notFoundResponse = filterInstancesByProgramAndSubjects({
    instances,
    filters: { subjects: ['notFoundSubject'] },
    instanceSubjectsProgramsAndClasses,
  });

  // Assert
  expect(response).toEqual(expectedResponse);
  expect(notFoundResponse).toEqual([]);
});

it('Should correctly filter instances by classes parsing data if needed', () => {
  // Arrange
  const instances = [instanceOne, instanceTwo];

  // Act
  const responseForInstanceOne = filterInstancesByProgramAndSubjects({
    instances,
    filters: { classes: instanceSubjectsProgramsAndClasses[instanceOne.id].classes },
    instanceSubjectsProgramsAndClasses,
  });
  const responseForInstanceTwo = filterInstancesByProgramAndSubjects({
    instances,
    filters: { classes: instanceSubjectsProgramsAndClasses[instanceTwo.id].classes },
    instanceSubjectsProgramsAndClasses,
  });

  // Assert
  expect(responseForInstanceOne).toEqual([instanceOne]);
  expect(responseForInstanceTwo).toEqual([instanceTwo]);
});

it('Should not filter if no programs, subjects or classes are passed', () => {
  // Arrange
  const instances = [{ id: '1' }, { id: '2' }];

  // Act
  const response = filterInstancesByProgramAndSubjects({
    instances,
    instanceSubjectsProgramsAndClasses,
  });

  // Assert
  expect(response).toEqual(instances);
});
