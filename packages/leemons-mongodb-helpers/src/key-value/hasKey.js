async function hasKey(model, key) {
  const result = await model.countDocuments({ key });
  return !!result;
}

module.exports = {
  hasKey,
};
