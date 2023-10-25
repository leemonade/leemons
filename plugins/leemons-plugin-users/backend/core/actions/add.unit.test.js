const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { add } = require('./add');
const { LeemonsError } = require('@leemons/error');
const { getServiceModels } = require('../../models');

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

it('Should throw an error if action already exists', async () => {
    // Arrange
    const ctx = generateCtx({
        actions: {
            'multilanguage.common.addManyByKey': () => {},
        },
        models: {
            Actions: newModel(mongooseConnection, 'Actions', getServiceModels().Actions.schema),
        }
    });

    const actionData = { actionName: 'testAction', order: 1 };
    await ctx.tx.db.Actions.create(actionData);

    // Act and Assert
    await expect(add({ ctx, ...actionData })).rejects.toThrow(LeemonsError);
});

it('Should add a new action correctly', async () => {
    // Arrange
    const ctx = generateCtx({
        actions: {
            'multilanguage.common.addManyByKey': () => {},
        },
        models: {
            Actions: newModel(mongooseConnection, 'Actions', getServiceModels().Actions.schema),
        }
    });

    const actionData = { actionName: 'testAction', order: 1 };

    // Act
    const response = await add({ ctx, ...actionData });

    // Assert
    expect(response.actionName).toEqual(actionData.actionName);
    expect(response.order).toEqual(actionData.order);
});

