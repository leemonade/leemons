const _ = require('lodash');

const { createSchema, createRelations } = require('./createSchema');

function mountModels(models, ctx) {
  // Use promises and not awaits for performance reasons
  return Promise.all(models.map((model) => createSchema(model, ctx))).then((modelsCollection) => {
    models.forEach((model) => {
      _.set(ctx.leemons, `${model.target ? `${model.target}.` : ''}${model.modelName}`, {
        ..._.cloneDeep(model),
        model: ctx.ORM.model(model.modelName, {
          tableName: model.schema.collectionName,
          idAttribute: model.schema.primaryKey.name,
        }),
      });
    });
    return Promise.all(
      modelsCollection.filter((model) => model).map((model) => createRelations(model, ctx))
    );
  });
}

module.exports = mountModels;
