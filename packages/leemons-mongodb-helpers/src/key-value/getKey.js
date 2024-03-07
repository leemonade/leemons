async function getKey(model, key) {
  const result = await model.findOne({ key });
  return result?.value;
}

module.exports = {
  getKey,
};
