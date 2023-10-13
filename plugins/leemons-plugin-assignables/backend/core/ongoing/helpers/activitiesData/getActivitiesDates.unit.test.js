const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { getActivitiesDates } = require('./getActivitiesDates');
const { datesSchema } = require('../../../../models/dates');

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

const instanceOne = { id: 'instanceOneId' };
const instanceTwo = { id: 'instanceTwoId' };
const assignationOne = { id: 'assignationOneId' };
const assignationTwo = { id: 'assignationTwoId' };

it('Should return correct dates when filtering by status and progress', async () => {
  const instances = [instanceOne, instanceTwo];
  const assignations = [assignationOne, assignationTwo];
  const filters = {
    status: true,
    progress: true,
    sort: 'start',
  };
  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });
  const initialValues = [
    {
      id: 'dateOne',
      type: 'assignableInstance',
      instance: instanceOne.id,
      name: 'start',
      date: new Date(),
    },
    {
      id: 'dateTwo',
      type: 'assignableInstance',
      instance: instanceOne.id,
      name: 'visibility',
      date: new Date(),
    },
    {
      id: 'dateThree',
      type: 'assignableInstance',
      instance: instanceTwo.id,
      name: 'deadline',
      date: new Date(),
    },
    {
      id: 'dateFour',
      type: 'assignation',
      instance: assignations[0].id,
      name: 'start',
      date: new Date(),
    },
    {
      id: 'dateFive',
      type: 'assignation',
      instance: assignations[1].id,
      name: 'end',
      date: new Date(),
    },
  ];
  await ctx.db.Dates.create(initialValues);

  const result = await getActivitiesDates({ instances, assignations, filters, ctx });

  expect(result).toHaveProperty('instances');
  expect(result).toHaveProperty('assignations');
  expect(result.instances[instanceOne.id]).toHaveProperty('start');
  expect(result.instances[instanceOne.id]).not.toHaveProperty('visibility');
  expect(result.instances[instanceTwo.id]).toHaveProperty('deadline');
  expect(result.assignations).toHaveProperty([assignationOne.id]);
  expect(result.assignations).toHaveProperty([assignationTwo.id]);
});

it('Should return correct dates when filtering only by status', async () => {
  const instances = [instanceOne, instanceTwo];
  const assignations = [assignationOne, assignationTwo];
  const filters = {
    status: true,
    progress: false,
  };
  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });
  const initialValues = [
    {
      id: 'dateOne',
      type: 'assignableInstance',
      instance: instanceOne.id,
      name: 'closed',
      date: new Date(),
    },
    {
      id: 'dateFour',
      type: 'assignation',
      instance: assignationOne.id,
      name: 'end',
      date: new Date(),
    },
    {
      id: 'dateFive',
      type: 'assignation',
      instance: assignationTwo.id,
      name: 'open',
      date: new Date(),
    },
  ];
  await ctx.db.Dates.create(initialValues);

  const result = await getActivitiesDates({ instances, assignations, filters, ctx });

  expect(result).toHaveProperty('instances');
  expect(result).toHaveProperty('assignations');
  expect(result.instances[instanceOne.id]).toHaveProperty('closed');
  expect(result.assignations).toMatchObject({});
});

it('Should return correct dates when filtering by studentDidOpen flag', async () => {
  const assignations = [assignationOne, assignationTwo];
  const filters = {
    studentDidOpen: true,
  };
  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });
  const initialValues = [
    {
      id: 'dateOne',
      type: 'assignableInstance',
      instance: instanceOne.id,
      name: 'start',
      date: new Date(),
    },
    {
      id: 'dateFour',
      type: 'assignation',
      instance: assignations[0].id,
      name: 'start',
      date: new Date(),
    },
    {
      id: 'dateFive',
      type: 'assignation',
      instance: assignations[1].id,
      name: 'open',
      date: new Date(),
    },
  ];
  await ctx.db.Dates.create(initialValues);

  const result = await getActivitiesDates({ assignations, filters, ctx });

  expect(result).toHaveProperty('instances');
  expect(result).toHaveProperty('assignations');
  expect(result.instances).toMatchObject({});
  expect(result.assignations).not.toHaveProperty(assignationOne.id);
  expect(result.assignations[assignationTwo.id]).toHaveProperty('open');
});
it('Should return correct dates when filtering by archivedFiles', async () => {
  const instances = [instanceOne, instanceTwo];
  const filters = {
    isArchived: true,
  };
  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });
  const initialValues = [
    {
      id: 'dateOne',
      type: 'assignableInstance',
      instance: instanceOne.id,
      name: 'start',
      date: new Date(),
    },
    {
      id: 'dateTwo',
      type: 'assignableInstance',
      instance: instanceOne.id,
      name: 'visibility',
      date: new Date(),
    },
    {
      id: 'dateThree',
      type: 'assignableInstance',
      instance: instanceTwo.id,
      name: 'archived',
      date: new Date(),
    },
    {
      id: 'dateFour',
      type: 'assignation',
      instance: assignationOne.id,
      name: 'start',
      date: new Date(),
    },
    {
      id: 'dateFive',
      type: 'assignation',
      instance: assignationTwo.id,
      name: 'end',
      date: new Date(),
    },
  ];
  await ctx.db.Dates.create(initialValues);

  const result = await getActivitiesDates({ instances, filters, ctx });

  expect(result).toHaveProperty('instances');
  expect(result).toHaveProperty('assignations');
  expect(result.assignations).toMatchObject({});
  expect(result.instances).not.toHaveProperty(instanceOne.id);
  expect(result.instances[instanceTwo.id]).toHaveProperty('archived');
});

it('Should return correct dates when filtering by studentCanSee flag', async () => {
  const instances = [instanceOne, instanceTwo];
  const assignations = [assignationOne, assignationTwo];
  const filters = {
    studentCanSee: true,
    sort: true,
  };
  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });
  const initialValues = [
    {
      id: 'dateOne',
      type: 'assignableInstance',
      instance: instanceOne.id,
      name: 'start',
      date: new Date(),
    },
    {
      id: 'dateThree',
      type: 'assignableInstance',
      instance: instanceOne.id,
      name: 'visibility',
      date: new Date(),
    },
    {
      id: 'dateTwo',
      type: 'assignableInstance',
      instance: instanceTwo.id,
      name: 'archived',
      date: new Date(),
    },
    {
      id: 'dateFour',
      type: 'assignation',
      instance: assignations[0].id,
      name: 'start',
      date: new Date(),
    },
    {
      id: 'dateFive',
      type: 'assignation',
      instance: assignations[1].id,
      name: 'end',
      date: new Date(),
    },
  ];
  await ctx.db.Dates.create(initialValues);

  const result = await getActivitiesDates({ instances, filters, ctx });

  expect(result).toHaveProperty('instances');
  expect(result).toHaveProperty('assignations');
  expect(result.assignations).toMatchObject({});
  expect(result.instances[instanceOne.id]).toHaveProperty('start');
  expect(result.instances[instanceOne.id]).toHaveProperty('visibility');
  expect(result.instances).not.toHaveProperty(instanceTwo.id);
});

it('Should return an empty object if no filters are passed', async () => {
  // Arrange
  const instances = [instanceOne, instanceTwo];
  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  // Act
  const response = await getActivitiesDates({ instances, filters: {}, ctx });

  // Assert
  expect(response).toEqual({});
});
