function generateQueries(model /* connector */) {
  const bookshelfModel = model.model;

  // TODO: Give the use the ability to use custom queries
  function create(newItem, parseOptions = {}) {
    return bookshelfModel
      .forge()
      .save(newItem, { method: 'insert' })
      .then((res) => (res ? res.toJSON(parseOptions) : res));
  }

  function update(updatedItem, parseOptions = {}) {
    return bookshelfModel
      .forge()
      .save(updatedItem, { method: 'update' })
      .then((res) => (res ? res.toJSON(parseOptions) : res));
  }

  function deleteOne(id, parseOptions = {}) {
    return bookshelfModel
      .forge({ [model.schema.primaryKey.name]: id })
      .destroy()
      .then((res) => (res ? res.toJSON(parseOptions) : res));
  }

  function findOne(query = {}, options = {}, parseOptions = {}) {
    return bookshelfModel
      .query(query)
      .fetch(options)
      .then((res) => (res ? res.toJSON(parseOptions) : res));
  }

  function find(query = {}, options = {}, parseOptions = {}) {
    return bookshelfModel
      .query(query)
      .fetchAll(options)
      .then((res) => (res ? res.toJSON(parseOptions) : res));
  }

  function count(query = {}) {
    return bookshelfModel.query(query).count();
  }
  return {
    create,
    update,
    deleteOne,
    find,
    findOne,
    count,
  };
}

module.exports = generateQueries;
