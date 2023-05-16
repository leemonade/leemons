const _ = require('lodash');
const createSchema = require('./createSchema');

function generateModel(models, ctx) {
  models.map((model) => {
    const { schema } = createSchema(model, ctx);

    const Model = ctx.ODM.model(model.modelName, schema);
    // return Schema;

    const fullModel = {
      // Spread original model
      ..._.cloneDeep(model),
      ODM: ctx.ODM,
      // ODM model
      model: Model,
    };

    // Set the model for the connector
    ctx.connector.models.set(model.modelName, fullModel);

    return Model;
  });
}

module.exports = generateModel;
