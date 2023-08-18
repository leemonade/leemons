function excludeDeleteIfNeedToQuery(query, { excludeDeleted = true } = {}) {
  if (excludeDeleted) {
    query.where({ isDeleted: false });
  }
  return query;
}

module.exports = { excludeDeleteIfNeedToQuery };
