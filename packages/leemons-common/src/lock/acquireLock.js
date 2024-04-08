const DUPLICATED_INDEX_ERROR_CODE = 11000;

/**
 * Acquires a lock for a given name using the KeyValueModel.
 * If the lock is already acquired, the function will return false.
 *
 * @param {Object} params - The parameters for acquiring a lock.
 * @param {Object} params.KeyValueModel - The model used to store key-value pairs.
 * @param {string} [params.lockKey='default'] - The name of the lock to acquire.
 * @returns {Promise<boolean>} - A promise that resolves to true if the lock was successfully acquired, false otherwise.
 */
async function acquireLock({
  KeyValueModel,
  lockKey = 'default',
  timeout = 300000 /* 5 minutes */,
}) {
  const expirationDate = new Date(Date.now() + timeout);

  try {
    const lock = await KeyValueModel.findOneAndUpdate(
      {
        key: lockKey,
        $or: [{ 'value.acquired': { $ne: true } }, { 'value.expiration': { $lt: new Date() } }],
      },
      { key: lockKey, value: { acquired: true, expiration: expirationDate } },
      { upsert: true, new: true }
    );

    return !!lock;
  } catch (e) {
    if (e.code === DUPLICATED_INDEX_ERROR_CODE) {
      return false;
    }

    throw e;
  }
}

module.exports = { acquireLock };
