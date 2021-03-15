const { createSchema, createRelations } = require('./createSchema');
const generateModel = require('./generateModel');

function mountModels(models, ctx) {
  // Create the schema
  return Promise.all(models.map((model) => createSchema(model, ctx))).then((modelsCollection) => {
    // Create bookshelf models
    generateModel(models, ctx);

    // Generate relations
    return Promise.all(
      modelsCollection.filter((model) => model).map((model) => createRelations(model, ctx))
    );
  });
}

module.exports = mountModels;
