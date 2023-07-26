function excludeDeleteIfNeedToQuery(query, { exludeDeleted = true } = {}) {
  if (exludeDeleted) {
    query.where({ isDeleted: false });
  }
  return query;
}

module.exports = { excludeDeleteIfNeedToQuery };
