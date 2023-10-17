const { addUserSubjectRoom } = require('./addUserSubjectRoom');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { getServiceModels } = require('../../../models');
const assignablesSchema = getServiceModels().Assignables.schema;
const assignationsSchema = getServiceModels().Assignations.schema;

describe('addUserSubjectRoom', () => {
  let ctx;
  let actions;

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
    actions = {
      'comunica.room.add': jest.fn(),
    };
    ctx = generateCtx({
      actions,
      models: {
        Assignables: newModel(
          mongooseConnection,
          'Assignables',
          assignablesSchema
        ),
        Assignations: newModel(
          mongooseConnection,
          'Assignations',
          assignationsSchema
        ),
      },
    });
  });

  it('should call the comunica.room.add action with the correct parameters', async () => {
    const params = {
      parentKey: 'parentKey',
      instance: {
        assignable: {
          asset: {
            name: 'assetName',
            id: 'assetId',
          },
        },
      },
      classe: {
        subject: {
          name: 'subjectName',
          id: 'subjectId',
          icon: {
            id: 'iconId',
          },
        },
        color: '#color',
        program: 'program',
      },
      assignation: {
        id: 'assignationId',
      },
      user: 'user',
      teachers: ['teacher1', 'teacher2'],
      ctx,
    };

    await addUserSubjectRoom(params);

    expect(actions['comunica.room.add']).toHaveBeenCalledWith({
      key: 'leemons-testing.subject|subjectId.assignation|assignationId.userAgent|user',
      name: 'teachersOfSubject',
      nameReplaces: {
        subjectName: 'subjectName',
      },
      icon: 'iconId',
      bgColor: '#color',
      parentRoom: 'parentKey',
      program: 'program',
      type: 'leemons-testing.assignation.user',
      userAgents: 'user',
      adminUserAgents: ['teacher1', 'teacher2'],
      metadata: {
        headerIconIsUrl: false,
        headerName: 'assetName',
        headerImage: 'assetId',
        headerIcon: 'iconId',
        headerBgColor: '#color',
      },
    });
  });
});
