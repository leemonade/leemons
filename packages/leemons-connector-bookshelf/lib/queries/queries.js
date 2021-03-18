const _ = require('lodash');
const { buildQuery } = require('leemons-utils');
const { parseFilters } = require('leemons-utils');

function generateQueries(model /* connector */) {
  const bookshelfModel = model.model;

  const selectAttributes = (attributes) =>
    _.pickBy(attributes, (value, key) => model.schema.allAttributes.includes(key));

  // TODO: Give the use the ability to use custom queries
  // Creates one new item
  function create(newItem) {
    const attributes = selectAttributes(newItem);
    return bookshelfModel
      .forge(attributes)
      .save(null, { method: 'insert' })
      .then((res) => res.toJSON());
  }

  // Updates one item matching the query
  async function update(query, updatedItem) {
    const entry = await bookshelfModel.where(query).fetch();

    if (!entry) {
      const err = new Error('entry.notFound');
      err.status = 404;
      throw err;
    }

    const attributes = selectAttributes(updatedItem);

    return Object.keys(attributes).length > 0
      ? entry.save(attributes, { method: 'update', patch: true }).then((res) => res.toJSON())
      : entry.toJSON();
  }

  // TODO: soft delete
  // Deletes one item matching the query
  async function deleteOne(query) {
    const entry = await bookshelfModel.where(query).fetch();

    if (!entry) {
      const err = new Error('entry.notFound');
      err.status = 404;
      throw err;
    }

    return entry.destroy().then(() => entry.toJSON());
  }

  function find(query) {
    const filters = parseFilters(query);
    const newQuery = buildQuery(model, filters);
    return bookshelfModel
      .query(newQuery)
      .fetchAll()
      .then((res) => (res ? res.toJSON() : res));
  }

  async function findOne(query) {
    const entry = await find({ ...query, $limit: 1 });
    return entry[0] || null;
  }

  function count(query) {
    const filters = parseFilters(query);
    const newQuery = buildQuery(model, filters);
    return bookshelfModel.query(newQuery).count();
  }
  return {
    create,
    update,
    delete: deleteOne,
    find,
    findOne,
    count,
  };
}

module.exports = generateQueries;
