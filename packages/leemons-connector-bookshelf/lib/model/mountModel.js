const { createSchema, createRelations } = require('./createSchema');

function mountModels(models, ctx) {
  // Use promises and not awaits for performance reasons
  return Promise.all(models.map((model) => createSchema(model, ctx))).then((modelsCollection) =>
    Promise.all(
      modelsCollection.filter((model) => model).map((model) => createRelations(model, ctx))
    )
  );
}

module.exports = mountModels;
