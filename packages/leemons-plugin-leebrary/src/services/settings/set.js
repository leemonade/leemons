const { isNil } = require('lodash');
const { tables } = require('../tables');
const { findOne } = require('./findOne');

// -----------------------------------------------------------------------------
// PRIVATE METHODS

/**
 * Creates a new settings object if none exists.
 * @async
 * @param {Object} transacting - The transaction object.
 * @returns {Object} The current settings object.
 */
async function ensureSettingsExist(transacting) {
  let currentSettings = await findOne({ transacting });
  if (isNil(currentSettings)) {
    currentSettings = await tables.settings.create({}, { transacting });
  }
  return currentSettings;
}

/**
 * Updates the settings object with new settings.
 * @async
 * @param {Object} currentSettings - The current settings object.
 * @param {Object} newSettings - The new settings to be applied.
 * @param {Object} transacting - The transaction object.
 * @returns {Object} The updated settings object.
 */
async function updateSettings(currentSettings, newSettings, transacting) {
  delete newSettings.id;
  return tables.settings.update({ id: currentSettings.id }, newSettings, { transacting });
}

// -----------------------------------------------------------------------------
// PUBLIC METHODS

/**
 * Sets the settings object with new settings.
 * @async
 * @param {Object} settings - The new settings to be applied.
 * @param {Object} options - The options for the transaction.
 * @param {Object} options.transacting - The transaction object.
 * @returns {Object} The updated settings object.
 */
async function set(settings, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const currentSettings = await ensureSettingsExist(transacting);
      const newSettings = { ...currentSettings, ...settings };
      return updateSettings(currentSettings, newSettings, transacting);
    },
    tables.settings,
    _transacting
  );
}

module.exports = { set };
