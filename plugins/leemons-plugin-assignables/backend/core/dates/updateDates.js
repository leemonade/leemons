const { pick, isNull, pickBy, negate, difference, keys, without } = require('lodash');
const { getDates } = require('./getDates');
// const { unregisterDates } = require('./unregisterDates');
const { registerDates } = require('./registerDates');
const { unregisterDates } = require('./unregisterDates');

// TODO: Verify if updateDates function is expected to remove the dates which are not used, this bug comes from leemons legacy

function getDiff(oldObject, newObject) {
  const newKeys = difference(keys(newObject), keys(oldObject));
  const deletedKeys = difference(keys(oldObject), keys(newObject));

  const commonKeys = without(keys(oldObject), ...newKeys.concat(deletedKeys));

  const updatedKeys = commonKeys.filter(
    (key) => oldObject[key]?.getTime() !== newObject[key]?.getTime()
  );

  return {
    added: newKeys,
    deleted: deletedKeys,
    updated: updatedKeys,
  };
}

/**
 *
 * @param {object} options
 * @param {string} options.type
 * @param {string} options.instance
 * @param {{[string]: Date}} options.dates
 * @param {object} ctx
 */
async function updateDates({ type, instance, dates, ctx }) {
  if (!type || !instance || !dates) {
    throw new Error('Cannot update dates: type, instance and dates are required');
  }

  const currentDates = await getDates({ type, instance, ctx });
  const { added, deleted, updated } = getDiff(currentDates, dates);

  if (deleted.length || updated.length) {
    await unregisterDates({ type, instance, name: updated, ctx });
    // await unregisterDates({ type, instance, name: deleted.concat(updated), ctx });
  }
  if (added.length || updated.length) {
    await registerDates({ type, instance, dates: pick(dates, added, updated), ctx });
  }

  return {
    type,
    instance,
    updatedDates: updated,
    newDates: added,
    removedDates: [], // deleted,
  };
}

module.exports = { updateDates };
