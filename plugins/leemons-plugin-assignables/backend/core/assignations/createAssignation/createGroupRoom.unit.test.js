const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { createGroupRoom } = require('./createGroupRoom');
const { getServiceModels } = require('../../../models');
const _ = require('lodash');

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

it('Should create a new group room if it does not exist', async () => {
  // Arrange
  const assignableInstanceId = 'assignable-instance-id';
  const instance = {
    assignable: {
      asset: {
        name: 'assetName',
        id: 'assetId',
      },
    },
  };
  const parentKey = 'parentKey';
  const classes = [
    {
      subject: {
        name: 'subjectName',
        icon: {
          id: 'iconId',
        },
      },
      program: 'program',
      color: '#color',
    },
  ];
  const teachers = ['teacher1'];
  const users = ['user1'];
  const ctx = generateCtx({
    actions: {
      'comunica.room.exists': () => false,
      'comunica.room.add': (params) => params,
    },
    models: {
      Assignables: newModel(
        mongooseConnection,
        'Assignables',
        getServiceModels().Assignables.schema
      ),
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        getServiceModels().Assignations.schema
      ),
    },
  });

  // Act
  const result = await createGroupRoom({
    assignableInstanceId,
    instance,
    parentKey,
    classes,
    teachers,
    users,
    ctx,
  });

  // Assert
  expect(result).toEqual({
    key: ctx.prefixPN(`instance:${assignableInstanceId}:group`),
    name: 'activityGroup',
    subName: _.map(classes, 'subject.name').join(','),
    parentRoom: parentKey,
    program: classes[0].program,
    icon: classes[0].subject.icon?.id,
    bgColor: classes[0].color,
    type: ctx.prefixPN('assignation.group'),
    metadata: {
      headerName: instance.assignable.asset.name,
      headerSubName: classes[0].subject.name,
      headerImage: instance.assignable.asset.id,
      headerIcon: classes[0].subject.icon?.id,
      headerBgColor: classes[0].color,
      headerIconIsUrl: false,
      iconIsUrl: false,
    },
    userAgents: users,
    adminUserAgents: teachers,
  });
});

it('Should create a new group room if it does not exist multi class', async () => {
  // Arrange
  const assignableInstanceId = 'assignable-instance-id';
  const instance = {
    assignable: {
      asset: {
        name: 'assetName',
        id: 'assetId',
      },
    },
  };
  const parentKey = 'parentKey';
  const classes = [
    {
      subject: {
        name: 'subjectName',
        icon: {
          id: 'iconId',
        },
      },
      program: 'program',
      color: '#color',
    },
    {
      subject: {
        name: 'subjectName2',
        icon: {
          id: 'iconId2',
        },
      },
      program: 'program2',
      color: '#color2',
    },
  ];
  const teachers = [];
  const users = [];
  const ctx = generateCtx({
    actions: {
      'comunica.room.exists': () => false,
      'comunica.room.add': (params) => params,
    },
    models: {
      Assignables: newModel(
        mongooseConnection,
        'Assignables',
        getServiceModels().Assignables.schema
      ),
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        getServiceModels().Assignations.schema
      ),
    },
  });

  // Act
  const result = await createGroupRoom({
    assignableInstanceId,
    instance,
    parentKey,
    classes,
    teachers,
    users,
    ctx,
  });

  // Assert
  expect(result).toEqual({
    key: ctx.prefixPN(`instance:${assignableInstanceId}:group`),
    name: 'activityGroup',
    subName: _.map(classes, 'subject.name').join(','),
    parentRoom: parentKey,
    program: classes[0].program,
    bgColor: '#67728E',
    icon: '/public/assets/svgs/module-three.svg',
    type: ctx.prefixPN('assignation.group'),
    metadata: {
      headerName: instance.assignable.asset.name,
      headerSubName: 'multisubjects',
      headerImage: instance.assignable.asset.id,
      headerIcon: '/public/assets/svgs/module-three.svg',
      headerBgColor: '#67728E',
      headerIconIsUrl: true,
      iconIsUrl: true,
    },
    userAgents: users,
    adminUserAgents: teachers,
  });
});

it('Should add extra students to the existing group room', async () => {
  // Arrange
  const assignableInstanceId = 'assignable-instance-id';
  const instance = {
    assignable: {
      asset: {
        name: 'assetName',
        id: 'assetId',
      },
    },
  };
  const parentKey = 'parentKey';
  const classes = [
    {
      subject: {
        name: 'subjectName',
        icon: {
          id: 'iconId',
        },
      },
      program: 'program',
      color: '#color',
    },
  ];
  const teachers = ['teacher1'];
  const users = ['user1'];
  const ctx = generateCtx({
    actions: {
      'comunica.room.exists': () => true,
      'comunica.room.addUserAgents': (params) => params,
      'comunica.room.get': (params) => params,
    },
    models: {
      Assignables: newModel(
        mongooseConnection,
        'Assignables',
        getServiceModels().Assignables.schema
      ),
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        getServiceModels().Assignations.schema
      ),
    },
  });

  // Act
  const result = await createGroupRoom({
    assignableInstanceId,
    instance,
    parentKey,
    classes,
    teachers,
    users,
    ctx,
  });

  // Assert
  expect(result).toEqual({
    key: ctx.prefixPN(`instance:${assignableInstanceId}:group`),
  });
});

it('Should add extra students to the existing group room withut teacher and user', async () => {
  // Arrange
  const assignableInstanceId = 'assignable-instance-id';
  const instance = {
    assignable: {
      asset: {
        name: 'assetName',
        id: 'assetId',
      },
    },
  };
  const parentKey = 'parentKey';
  const classes = [
    {
      subject: {
        name: 'subjectName',
        icon: {
          id: 'iconId',
        },
      },
      program: 'program',
      color: '#color',
    },
  ];
  const teachers = [];
  const users = [];
  const ctx = generateCtx({
    actions: {
      'comunica.room.exists': () => true,
      'comunica.room.addUserAgents': (params) => params,
      'comunica.room.get': (params) => params,
    },
    models: {
      Assignables: newModel(
        mongooseConnection,
        'Assignables',
        getServiceModels().Assignables.schema
      ),
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        getServiceModels().Assignations.schema
      ),
    },
  });

  // Act
  const result = await createGroupRoom({
    assignableInstanceId,
    instance,
    parentKey,
    classes,
    teachers,
    users,
    ctx,
  });

  // Assert
  expect(result).toEqual({
    key: ctx.prefixPN(`instance:${assignableInstanceId}:group`),
  });
});
