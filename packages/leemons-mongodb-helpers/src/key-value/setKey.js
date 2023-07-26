async function setKey(model, key) {
  return model.updateOne({ key }, { key }, { upsert: true });
}

module.exports = {
  setKey,
};
