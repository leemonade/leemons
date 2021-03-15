function queries(model) {
  const bookshelfModel = model.model;
  function create(newItem) {
    return bookshelfModel
      .forge()
      .save(newItem, { method: 'insert' })
      .then((res) => res.toJSON());
  }

  function update(updatedItem) {
    return bookshelfModel
      .forge()
      .save(updatedItem, { method: 'update' })
      .then((res) => res.toJSON());
  }

  function deleteOne(id) {
    return bookshelfModel
      .forge({ [model.schema.primaryKey.name]: id })
      .destroy()
      .then((res) => res.toJSON());
  }

  function find(query = {}) {
    return bookshelfModel
      .query(query)
      .fetchAll()
      .then((data) => data.toJSON());
  }

  function count(query = {}) {
    return bookshelfModel.query(query).count();
  }
  return {
    create,
    update,
    deleteOne,
    find,
    count,
  };
}

module.exports = queries;
