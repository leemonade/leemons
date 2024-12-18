/**
 * @typedef {import('mongoose').Model} Model
 * @typedef {import('mongoose').DeleteResult} DeleteResult
 *
 * Deletes a key from the key-value store.
 *
 * @param {Model} model - The model to delete the key from.
 * @param {string} key - The key to delete.
 * @returns {Promise<DeleteResult>} A promise that resolves to the result of the delete operation.
 */
function deleteKey(model, key) {
  return model.deleteOne({ key });
}

module.exports = {
  deleteKey,
};
