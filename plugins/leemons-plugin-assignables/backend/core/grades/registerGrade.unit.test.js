const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { registerGrade } = require('./registerGrade');
const { gradesSchema } = require('../../models/grades');

let mongooseConnection;
let disconnectMongoose;

beforeAll(async () => {
  const { mongoose, disconnect } = await createMongooseConnection();

  mongooseConnection = mongoose;
  disconnectMongoose = disconnect;
});

afterAll(async () => {
  await disconnectMongoose();

  mongooseConnection = null;
  disconnectMongoose = null;
});

beforeEach(async () => {
  await mongooseConnection.dropDatabase();
});

it('Should register the grade', async () => {
  // Arrange
  const assignation = 'assignation-id';
  const subject = 'subject-id';
  const type = 'main';
  const grade = 10;
  const gradedBy = 'main-teacher';
  const feedback = 'This is your teacher feedback';
  const visibleToStudent = true;

  const expectedValue = {
    assignation,
    subject,
    type,
    grade,
    gradedBy,
    feedback,
    visibleToStudent,
  };

  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  // Act
  const response = await registerGrade({
    assignation,
    subject,
    type,
    grade,
    gradedBy,
    feedback,
    visibleToStudent,
    ctx,
  });
  const foundValue = await ctx.db.Grades.findOne({}).lean();

  // Assert
  expect(response).toEqual(expect.objectContaining(expectedValue));

  expect(foundValue).toEqual(expect.objectContaining(expectedValue));
});

it('Should throw if required params are not provided', async () => {
  // Arrange
  const assignation = 'assignation-id';
  const subject = 'subject-id';
  const type = 'main';
  const grade = 10;
  const gradedBy = 'main-teacher';
  const feedback = 'This is your teacher feedback';
  const visibleToStudent = true;

  const ctx = generateCtx({
    models: {
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  // Act
  const noAssignationFn = () =>
    registerGrade({
      assignation: undefined,
      subject,
      type,
      grade,
      gradedBy,
      feedback,
      visibleToStudent,
      ctx,
    });
  const noSubjectFn = () =>
    registerGrade({
      assignation,
      subject: undefined,
      type,
      grade,
      gradedBy,
      feedback,
      visibleToStudent,
      ctx,
    });
  const noTypeFn = () =>
    registerGrade({
      assignation,
      subject,
      type: undefined,
      grade,
      gradedBy,
      feedback,
      visibleToStudent,
      ctx,
    });
  const testFn4 = () =>
    registerGrade({
      assignation,
      subject,
      type,
      grade: undefined,
      gradedBy,
      feedback,
      visibleToStudent,
      ctx,
    });
  const noGradedByFn = () =>
    registerGrade({
      assignation,
      subject,
      type,
      grade,
      gradedBy: undefined,
      feedback,
      visibleToStudent,
      ctx,
    });
  const noVisibleToStudentFn = () =>
    registerGrade({
      assignation,
      subject,
      type,
      grade,
      gradedBy,
      feedback,
      visibleToStudent: undefined,
      ctx,
    });

  // Assert
  await expect(noAssignationFn).rejects.toThrow();
  await expect(noSubjectFn).rejects.toThrow();
  await expect(noTypeFn).rejects.toThrow();
  await expect(testFn4).rejects.toThrow();
  await expect(noGradedByFn).rejects.toThrow();
  await expect(noVisibleToStudentFn).rejects.toThrow();
});
