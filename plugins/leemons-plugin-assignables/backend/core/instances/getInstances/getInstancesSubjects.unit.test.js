const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { getInstancesSubjects } = require('./getInstancesSubjects');

const classesByIdsHandler = jest.fn();

it('Should return subjects per instance', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'academic-portfolio.classes.classByIds': classesByIdsHandler,
    },
  });
  const classesPerInstance = {
    instance1: ['class1', 'class2'],
    instance2: ['class2'],
  };

  classesByIdsHandler.mockReturnValue([
    { id: 'class1', program: 'program1', subject: { id: 'subject1' } },
    { id: 'class2', program: 'program2', subject: { id: 'subject2' } },
  ]);

  // Act
  const response = await getInstancesSubjects({ classesPerInstance, ctx });

  // Assert
  expect(classesByIdsHandler).toBeCalledWith({
    ids: ['class1', 'class2'],
    withProgram: false,
    withTeachers: false,
    noSearchChildren: true,
    noSearchParents: true,
  });
  expect(response).toEqual({
    instance1: [
      { program: 'program1', subject: 'subject1' },
      { program: 'program2', subject: 'subject2' },
    ],
    instance2: [{ program: 'program2', subject: 'subject2' }],
  });
});
