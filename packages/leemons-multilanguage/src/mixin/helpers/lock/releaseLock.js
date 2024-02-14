const { getLockName } = require('./getLockName');

/**
 * Releases a lock for a given name using the KeyValueModel.
 *
 * @param {Object} params - The parameters for acquiring a lock.
 * @param {Object} params.KeyValueModel - The model used to store key-value pairs.
 * @param {string} [params.lockName='default'] - The name of the lock to acquire.
 * @returns {Promise<boolean>} - A promise that resolves to true if the lock was successfully acquired, false otherwise.
 */
async function releaseLock({ KeyValueModel, lockName = 'default' }) {
  const lockKey = getLockName(lockName);

  await KeyValueModel.deleteOne({ key: lockKey });
}

module.exports = { releaseLock };
