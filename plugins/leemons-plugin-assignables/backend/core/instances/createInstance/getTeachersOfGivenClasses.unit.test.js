// Importing required modules and functions
const { it, beforeEach, expect } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { getTeachersOfGivenClasses } = require('./getTeachersOfGivenClasses');

const classesByIdsHandler = jest.fn();
let ctx;

beforeEach(() => {
  jest.resetAllMocks();
  ctx = generateCtx({
    actions: {
      'academic-portfolio.classes.classByIds': classesByIdsHandler,
    },
  });
});

// Test case for getTeachersOfGivenClasses function
it('Should return teachers of given classes', async () => {
  // Arrange
  const classes = ['classId1', 'classId2'];

  classesByIdsHandler.mockResolvedValue([
    {
      id: 'classId1',
      teachers: [{ teacher: 'teacherId1' }, { teacher: 'teacherId2' }],
    },
    {
      id: 'classId2',
      teachers: [{ teacher: 'teacherId2' }, { teacher: 'teacherId3' }],
    },
  ]);

  // Act
  const response = await getTeachersOfGivenClasses({ classes, ctx });

  // Assert
  expect(classesByIdsHandler).toBeCalledWith({
    ids: classes,
  });

  expect(response).toEqual([
    { teacher: 'teacherId1' },
    { teacher: 'teacherId2' },
    { teacher: 'teacherId3' },
  ]);
});

it('Should return empty array if no teachers are found', async () => {
  // Arrange
  const classes = ['classId1', 'classId2'];

  classesByIdsHandler.mockResolvedValue([
    { id: 'classId1', teachers: [] },
    { id: 'classId2', teachers: [] },
  ]);

  // Act
  const response = await getTeachersOfGivenClasses({ classes, ctx });

  // Assert
  expect(classesByIdsHandler).toBeCalledWith({
    ids: classes,
  });

  expect(response).toEqual([]);
});
