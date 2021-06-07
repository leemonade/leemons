const _ = require('lodash');
const pmap = require('p-map');

const { buildQuery } = require('leemons-utils');
const { parseFilters } = require('leemons-utils');

function generateQueries(model /* connector */) {
  const bookshelfModel = model.model;
  const selectAttributes = (attributes) =>
    _.pickBy(attributes, (value, key) => model.schema.allAttributes.includes(key));

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

    return bookshelfModel
      .query(newQuery)
      .destroy({ transacting })
      .then((entries) => entries.toJSON());
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
  function count(query) {
    const filters = parseFilters({ filters: query, model });
    const newQuery = buildQuery(model, filters);

    return bookshelfModel.query(newQuery).count();
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

  async function transaction(f) {
    return model.ORM.transaction(f);
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
    set,
    transaction,
  };
}

module.exports = generateQueries;
