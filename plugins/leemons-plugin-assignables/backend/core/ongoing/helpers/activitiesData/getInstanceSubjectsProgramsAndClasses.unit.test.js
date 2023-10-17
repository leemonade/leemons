const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const {
  getInstanceSubjectsProgramsAndClasses,
} = require('./getInstanceSubjectsProgramsAndClasses');
const { classesSchema } = require('../../../../models/classes');

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

const mockClassOne = {
  id: 'classOneId',
  subject: { id: 'subjectOneId' },
  program: 'programA',
};
const mockClassTwo = {
  id: 'classTwoId',
  subject: { id: 'subjectTwoId' },
  program: 'programB',
};
const mockClassThree = {
  id: 'classThreeId',
  subject: { id: 'subjectThreeId' },
  program: 'programB',
};

it('Should call getInstanceSubjectsProgramsAndClasses correctly', async () => {
  // Arrange
  const instances = [instanceOne, instanceTwo];
  const classByIdsAction = fn().mockResolvedValue([
    mockClassOne,
    mockClassTwo,
    mockClassThree,
  ]);

  const ctx = generateCtx({
    actions: {
      'academic-portfolio.classes.classByIds': classByIdsAction,
    },
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });
  const mockClassRelationOne = {
    id: 1,
    assignableInstance: instanceOne.id,
    assignable: instanceOne.assignable.id,
    class: mockClassOne.id,
  };
  const mockClassRelationTwo = {
    id: 2,
    assignableInstance: instanceTwo.id,
    assignable: instanceTwo.assignable.id,
    class: mockClassTwo.id,
  };
  const mockClassRelationThree = {
    id: 3,
    assignableInstance: instanceTwo.id,
    assignable: instanceTwo.assignable.id,
    class: mockClassThree.id,
  };
  const initialValues = [
    mockClassRelationOne,
    mockClassRelationTwo,
    mockClassRelationThree,
  ];
  await ctx.db.Classes.create([
    ...initialValues,
    {
      ...mockClassRelationOne,
      id: 4,
      assignableInstance: 'anotherAssignableInstance',
    },
  ]);

  const expectedResponse = {
    [instances[0].id]: {
      subjects: [mockClassOne.subject.id],
      programs: [mockClassOne.program],
      classes: [mockClassRelationOne.class],
    },
    [instances[1].id]: {
      subjects: expect.arrayContaining([
        mockClassTwo.subject.id,
        mockClassThree.subject.id,
      ]),
      programs: [mockClassTwo.program],
      classes: expect.arrayContaining([
        mockClassRelationTwo.class,
        mockClassRelationThree.class,
      ]),
    },
  };

  // Act
  const response = await getInstanceSubjectsProgramsAndClasses({
    instances,
    ctx,
  });

  // Assert
  expect(classByIdsAction).toBeCalledWith({
    ids: expect.arrayContaining(initialValues.map((item) => item.class)),
  });
  expect(response).toEqual(expectedResponse);
});
