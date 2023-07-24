async function setKey(model, key) {
  return model.updateOne({ key }, { upsert: true });
}

module.exports = {
  setKey,
};
