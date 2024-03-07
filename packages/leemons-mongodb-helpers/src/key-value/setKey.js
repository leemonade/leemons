async function setKey(model, key, value) {
  const toUpdate = { key };
  if (typeof value !== 'undefined') {
    toUpdate.value = value;
  }
  return model.updateOne({ key }, toUpdate, { upsert: true });
}

module.exports = {
  setKey,
};
