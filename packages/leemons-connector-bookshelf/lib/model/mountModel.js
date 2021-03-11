const createSchema = require('./createSchema');

function mountModels(models, ctx) {
  return models.map(
    (model) => createSchema(model, ctx)
    // console.log(model);
    // ctx.ORM.knex.schema.hasTable(model.collectionName).then((exists) => {
    //   if (!exists) {
    //     console.log('Create Table', model.collectionName);
    //     ctx.ORM.knex.schema
    //       .createTable(model.collectionName, (table) => {
    //         table.increments();
    //       })
    //       .then((d) => console.log(`Table ${model.collectionName} created`));
    //   }
    // });
    // ctx.ORM.model(model.)
  );
}

module.exports = mountModels;
