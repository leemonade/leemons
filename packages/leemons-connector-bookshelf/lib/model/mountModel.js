const { createSchema, createRelations } = require('./createSchema');
const generateModel = require('./generateModel');

function mountModels(models, ctx) {
  // Create the schema
  return ctx.ORM.transaction((transacting) =>
    Promise.all(models.map((model) => createSchema(model, ctx, transacting))).then(() => {
      // Create bookshelf models
      generateModel(models, ctx);
      // Generate relations
      return Promise.all(models.map((model) => createRelations(model, ctx)));
    })
  );
}

module.exports = mountModels;
