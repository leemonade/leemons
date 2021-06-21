function withTransaction(callback, model, transacting) {
  if (transacting) {
    return callback(transacting);
  }
  return (typeof model === 'string' ? leemons.query(model) : model).transaction((t) => callback(t));
}

module.exports = { withTransaction };
