const { parseFilters } = require('leemons-utils');
const buildQuery = require('./buildQuery');

function generateQueries(model) {
  const MongooseModel = model.model;

  async function create(newItem, { transacting } = {}) {
    const item = new MongooseModel(newItem);
    const response = await item.save({ session: transacting });
    return response;
  }

  async function createMany(newItems, { transacting } = {}) {
    if (!Array.isArray(newItems)) {
      throw new Error(
        `createMany expected an array, instead got ${
          typeof newItems === 'object' ? JSON.stringify(newItems) : newItems
        }`
      );
    }

    return MongooseModel.insertMany(newItems, { session: transacting });
  }

  async function find(query = {}, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    return $extras(MongooseModel.find(finalQuery, undefined, { session: transacting }));
  }

  async function findOne(query = {}, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    return $extras(MongooseModel.findOne(finalQuery, undefined, { session: transacting }));
  }

  async function deleteOne(query = {}, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const finalQuery = buildQuery(model, filters);

    return MongooseModel.deleteOne(finalQuery, { session: transacting });
  }

  async function deleteMany(query = {}, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    return $extras(MongooseModel.deleteMany(finalQuery, { session: transacting }));
  }

  async function transaction(f) {
    return new Promise((resolve, reject) => {
      model.ODM.transaction(
        (t) =>
          f(t)
            .then(resolve)
            .catch((e) => {
              reject(e);
              throw e;
            })
        // Catch roll back error, the real error is in the promise
      ).catch(() => {});
    });
  }

  return {
    create,
    createMany,
    find,
    findOne,
    delete: deleteOne,
    deleteMany,
    transaction,
  };
}

module.exports = generateQueries;
