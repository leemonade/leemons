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

  async function count(query = {}, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    return $extras(MongooseModel.countDocuments(finalQuery, { session: transacting }));
  }

  async function search(query = {}, page = 0, size = 10, { transacting } = {}) {
    if (size < 1) {
      throw new Error('The size should be at least 1');
    }
    if (page < 0) {
      throw new Error('The page should be at least 0');
    }

    const totalCount = await count(query, { transacting });
    const totalPages = Math.floor(totalCount / size);

    if (page > totalPages) {
      return {
        items: [],
        count: 0,
        totalCount,
        page,
        size,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 0 ? page - 1 : null,
      };
    }

    const items = await find({ ...query, $limit: size, $offset: page * size }, { transacting });

    return {
      items,
      count: items.length,
      totalCount,
      page,
      size,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 0 ? page - 1 : null,
    };
  }

  async function update(query = {}, item, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    return $extras(MongooseModel.updateOne(finalQuery, item, { session: transacting }));
  }

  async function updateMany(query = {}, item, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    return $extras(MongooseModel.updateMany(finalQuery, item, { session: transacting }));
  }

  async function set(query = {}, item, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    return $extras(
      MongooseModel.updateOne(finalQuery, item, { session: transacting, upsert: true })
    );
  }

  async function setMany(query = {}, item, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    return $extras(
      MongooseModel.updateMany(finalQuery, item, {
        session: transacting,
        upsert: true,
      })
    );
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
    search,
    count,
    update,
    updateMany,
    set,
    setMany,
    delete: deleteOne,
    deleteMany,
    transaction,
  };
}

module.exports = generateQueries;
