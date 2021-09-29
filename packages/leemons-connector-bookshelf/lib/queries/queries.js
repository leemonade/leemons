const _ = require('lodash');
const pmap = require('p-map');

const { buildQuery } = require('leemons-utils');
const { parseFilters } = require('leemons-utils');

function generateQueries(model /* connector */) {
  const bookshelfModel = model.model;
  const selectAttributes = (attributes) =>
    _.pickBy(attributes, (value, key) => model.schema.allAttributes.includes(key));

  // Creates one new item
  async function create(newItem, { transacting } = {}) {
    const attributes = selectAttributes(newItem);
    return bookshelfModel
      .forge(attributes)
      .save(null, { method: 'insert', transacting })
      .then((res) => res.toJSON());
  }

  // Creates many items in one transaction
  function createMany(newItems, { transacting } = {}) {
    if (!Array.isArray(newItems)) {
      throw new Error(
        `createMany expected an array, instead got ${
          typeof newItems === 'object' ? JSON.stringify(newItems) : newItems
        }`
      );
    }
    if (transacting) {
      return pmap(newItems, (newItem) => create(newItem, { transacting }));
    }

    // If we are not on a transaction, make a new transaction
    return model.ORM.transaction((t) =>
      pmap(newItems, (newItem) => create(newItem, { transacting: t }))
    );
  }

  // Updates one item matching the query
  async function update(query, updatedItem, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const newQuery = buildQuery(model, filters);

    const entry = await bookshelfModel.query(newQuery).fetch({ transacting, require: false });

    if (!entry) {
      const err = new Error('entry.notFound');
      err.status = 404;
      throw err;
    }

    if (!_.has(updatedItem, 'updated_at')) {
      _.set(updatedItem, 'updated_at', new Date());
    }
    const attributes = selectAttributes(updatedItem);

    return Object.keys(attributes).length > 0
      ? entry
          .save(attributes, { method: 'update', patch: true, transacting })
          .then((res) => res.toJSON())
      : entry.toJSON();
  }

  // Updated many items in one transaction
  async function updateMany(query, updatedItem, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const newQuery = buildQuery(model, filters);

    const entry = () => bookshelfModel.query(newQuery);

    if (!_.has(updatedItem, 'updated_at')) {
      _.set(updatedItem, 'updated_at', new Date());
    }

    const attributes = selectAttributes(updatedItem);

    const updatedCount = await entry().count({ transacting });

    if (updatedCount > 0) {
      try {
        await entry().save(attributes, {
          method: 'update',
          patch: true,
          transacting,
        });
      } catch (err) {
        if (err.message !== 'EmptyResponse') {
          throw err;
        }
      }
    }

    return { count: updatedCount };
  }

  // TODO: soft delete
  // Deletes one item matching the query
  async function deleteOne(query, { transacting } = {}) {
    const filters = parseFilters({ filters: { ...query, $limit: 1 }, model });
    const newQuery = buildQuery(model, filters);

    const entry = await bookshelfModel.query(newQuery).fetch({ transacting, require: false });

    if (!entry) {
      const err = new Error('entry.notFound');
      err.status = 404;
      throw err;
    }

    return entry.destroy({ transacting }).then(() => entry.toJSON());
  }

  // Deletes many items matching the query
  async function deleteMany(query, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const newQuery = buildQuery(model, filters);

    const entries = () => bookshelfModel.query(newQuery);

    const deletedCount = await entries().count({ transacting });

    if (deletedCount > 0) {
      await entries().destroy({ transacting });
    }

    return { count: deletedCount };
  }

  // Finds all items based on a query
  function find(query, { columns = '*', related, transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const newQuery = buildQuery(model, filters);

    // TODO: Move to joins
    const toJSONConfig = { omitPivot: true };
    if (columns && columns !== '*') {
      toJSONConfig.hidden = [];
    }

    return bookshelfModel
      .query(newQuery)
      .fetchAll({
        columns,
        withRelated: related,
        transacting,
      })
      .then((res) => (res ? res.serialize(toJSONConfig) : res));
  }

  // Finds one item based on a query
  async function findOne(query, ...rest) {
    const entry = await find({ ...query, $limit: 1 }, ...rest);
    return entry[0] || null;
  }

  // Finds how many items exists based on a query
  async function count(query, { transacting } = {}) {
    return (await find(query, { columns: ['id'], transacting })).length;
  }

  // Finds all items based on a query, a limit and an offset (page)
  async function search(query, page = 0, size = 10, { transacting } = {}) {
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

  async function set(query, item, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const newQuery = buildQuery(model, filters);
    const entry = await bookshelfModel.query(newQuery).fetch({
      require: false,
      transacting,
    });

    if (entry) {
      if (!_.has(item, 'updated_at')) {
        _.set(item, 'updated_at', new Date());
      }
      const attributes = selectAttributes(item);
      return Object.keys(attributes).length > 0
        ? entry
            .save(attributes, { method: 'update', patch: true, transacting })
            .then((res) => res.toJSON())
        : entry.toJSON();
    }
    return create({ ...query, ...item }, { transacting });
  }

  function setMany(newItems, { transacting } = {}) {
    if (!Array.isArray(newItems)) {
      throw new Error(
        `setMany expected an array, instead got ${
          typeof newItems === 'object' ? JSON.stringify(newItems) : newItems
        }`
      );
    }
    if (transacting) {
      return pmap(newItems, (newItem) => set(newItem.query, newItem.item, { transacting }));
    }

    // If we are not on a transaction, make a new transaction
    return model.ORM.transaction((t) =>
      pmap(newItems, (newItem) => set(newItem.query, newItem.item, { transacting: t }))
    );
  }

  async function transaction(f) {
    return model.ORM.transaction(f);
  }

  async function timeoutPromise(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  async function reTry(func, args, time = 10, n = 0) {
    try {
      return await func(...args);
    } catch (e) {
      if (n < 10000 && e.code === 'ER_LOCK_DEADLOCK') {
        await timeoutPromise(time);
        return reTry(func, args, n + 1);
      }
      throw e;
    }
  }

  return {
    create: (...args) => reTry(create, args),
    createMany: (...args) => reTry(createMany, args),
    update: (...args) => reTry(update, args),
    updateMany: (...args) => reTry(updateMany, args),
    delete: (...args) => reTry(deleteOne, args),
    deleteMany: (...args) => reTry(deleteMany, args),
    find: (...args) => reTry(find, args),
    findOne: (...args) => reTry(findOne, args),
    search: (...args) => reTry(search, args),
    count: (...args) => reTry(count, args),
    set: (...args) => reTry(set, args),
    setMany: (...args) => reTry(setMany, args),
    transaction,
  };
}

module.exports = generateQueries;
