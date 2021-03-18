const _ = require('lodash');
const { buildQuery } = require('leemons-utils');
const { parseFilters } = require('leemons-utils');
const pmap = require('p-map');

function generateQueries(model /* connector */) {
  const bookshelfModel = model.model;
  const selectAttributes = (attributes) =>
    _.pickBy(attributes, (value, key) => model.schema.allAttributes.includes(key));

  // TODO: Give the use the ability to use custom queries
  // Creates one new item
  function create(newItem, { transacting } = {}) {
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

    const entry = await bookshelfModel.query(newQuery).fetch({ transacting });

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
  function updateMany(updateArray, { transacting } = {}) {
    if (!Array.isArray(updateArray)) {
      throw new Error(
        `updateMany expected an array, instead got ${
          typeof updateArray === 'object' ? JSON.stringify(updateArray) : updateArray
        }`
      );
    }
    if (transacting) {
      return pmap(updateArray, ({ query, item }) => update(query, item, { transacting }));
    }

    // If we are not on a transaction, make a new transaction
    return model.ORM.transaction((t) =>
      pmap(updateArray, ({ query, item }) => update(query, item, { transacting: t }))
    );
  }

  // TODO: soft delete
  // Deletes one item matching the query
  async function deleteOne(query, { transacting } = {}) {
    const filters = parseFilters({ filters: { ...query, $limit: 1 }, model });
    const newQuery = buildQuery(model, filters);

    const entry = await bookshelfModel.query(newQuery).fetch({ transacting });

    if (!entry) {
      const err = new Error('entry.notFound');
      err.status = 404;
      throw err;
    }

    return entry.destroy({ transacting }).then(() => entry.toJSON());
  }

  async function deleteMany(query, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const newQuery = buildQuery(model, filters);

    return bookshelfModel
      .query(newQuery)
      .destroy({ transacting })
      .then((entries) => entries.toJSON());
  }

  function find(query, columns = '*', related, { transacting } = {}) {
    const filters = parseFilters({ filters: query, model });
    const newQuery = buildQuery(model, filters);

    // TODO: Move to joins
    const toJSONConfig = {};
    if (columns !== '*' && columns !== null) {
      toJSONConfig.hidden = [];
    }

    return bookshelfModel
      .query(newQuery)
      .fetchAll({
        columns,
        withRelated: related,
        transacting,
      })
      .then((res) => (res ? res.toJSON(toJSONConfig) : res));
  }

  async function findOne(query, columns, related, ...rest) {
    const entry = await find({ ...query, $limit: 1 }, columns, related, ...rest);
    return entry[0] || null;
  }

  function count(query) {
    const filters = parseFilters({ filters: query, model });
    const newQuery = buildQuery(model, filters);
    return bookshelfModel.query(newQuery).count();
  }
  return {
    create,
    createMany,
    update,
    updateMany,
    delete: deleteOne,
    deleteMany,
    find,
    findOne,
    count,
  };
}

module.exports = generateQueries;
