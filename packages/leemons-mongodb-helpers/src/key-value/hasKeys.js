async function hasKeys(model, keys) {
  const result = await model.countDocuments({ key: keys });
  return result === keys.length;
}

module.exports = {
  hasKeys,
};
