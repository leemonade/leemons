// TODO: Add columns and select distinct

const { parseFilters } = require('leemons-utils');
const buildQuery = require('./buildQuery');

function transformId(result, reverse = false) {
  const incoming = reverse ? 'id' : '_id';
  const outgoing = reverse ? '_id' : 'id';

  if (Array.isArray(result)) {
    return result.map((item) => {
      if (item[incoming]) {
        const _item = item?.toJSON?.call(item) || item;
        const returnObj = {
          [outgoing]: _item[incoming]?.toString() || _item[incoming],
          ..._item,
        };

        delete returnObj[incoming];
        return returnObj;
      }
      return item?.toJSON?.call(item) || item;
    });
  }

  if (result) {
    const item = result?.toJSON?.call(result) || result;
    if (item[incoming]) {
      const returnObj = {
        [outgoing]: item[incoming]?.toString() || item[incoming],
        ...item,
      };
      delete returnObj[incoming];
      return returnObj;
    }
  }

  return result;
}

function generateQueries(model) {
  const MongooseModel = model.model;

  async function create(newItem, { transacting } = {}) {
    const item = new MongooseModel(transformId(newItem));
    const response = await item.save({ session: transacting });
    return transformId(response);
  }

  async function createMany(newItems, { transacting } = {}) {
    if (!Array.isArray(newItems)) {
      throw new Error(
        `createMany expected an array, instead got ${
          typeof newItems === 'object' ? JSON.stringify(newItems) : newItems
        }`
      );
    }

    const response = await MongooseModel.insertMany(transformId(newItems), {
      session: transacting,
    });
    return transformId(response);
  }

  async function find(query = {}, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    const response = await $extras(
      MongooseModel.find(finalQuery, undefined, { session: transacting })
    );

    return transformId(response);
  }

  async function findOne(query = {}, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    const response = await $extras(
      MongooseModel.findOne(finalQuery, undefined, { session: transacting })
    );

    if (response === null) {
      const err = new Error('entry.notFound');
      err.status = 404;
      throw err;
    }

    return transformId(response);
  }

  async function count(query = {}, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    const response = await $extras(
      MongooseModel.countDocuments(finalQuery, { session: transacting })
    );
    return transformId(response);
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
      items: transformId(items),
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

    const updateResult = await $extras(
      MongooseModel.updateOne(finalQuery, transformId(item), { session: transacting })
    );

    if (updateResult.matchedCount === 0) {
      const err = new Error('entry.notFound');
      err.status = 404;
      throw err;
    }

    const response = await findOne(query, { transacting });

    return transformId(response);
  }

  async function updateMany(query = {}, item, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    const response = await $extras(
      MongooseModel.updateMany(finalQuery, transformId(item), { session: transacting })
    );

    return { count: response.modifiedCount };
  }

  async function set(query = {}, item, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    const response = await $extras(
      MongooseModel.updateOne(finalQuery, transformId(item), {
        session: transacting,
        upsert: true,
      })
    );
    return transformId(response);
  }

  async function setMany(query = {}, item, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    const response = await $extras(
      MongooseModel.updateMany(finalQuery, transformId(item), {
        session: transacting,
        upsert: true,
      })
    );
    return transformId(response);
  }

  async function deleteOne(
    query = {},
    { soft = model.schema.options.softDelete || false, transacting } = {}
  ) {
    const filters = parseFilters({ filters: query, model });
    const finalQuery = buildQuery(model, filters);

    if (soft) {
      await MongooseModel.updateOne(
        finalQuery,
        { deleted: true, deleted_at: new Date() },
        { session: transacting }
      );
      return { soft: true, deleted: true };
    }
    const response = await MongooseModel.deleteOne(finalQuery, { session: transacting });

    if (response.deletedCount === 0) {
      const err = new Error('entry.notFound');
      err.status = 404;
      throw err;
    }

    return { soft: false, deleted: true };
  }

  async function deleteMany(
    query = {},
    { soft = model.schema.options.softDelete || false, transacting } = {}
  ) {
    if (soft) {
      const { count: updateCount } = await updateMany(
        query,
        { deleted: true, deleted_at: new Date() },
        { transacting }
      );
      return { soft: true, count: updateCount };
    }

    const filters = parseFilters({ filters: query, model });
    const { $extras, ...finalQuery } = buildQuery(model, filters);

    const response = await $extras(MongooseModel.deleteMany(finalQuery, { session: transacting }));
    return { soft: false, count: response.deletedCount };
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
