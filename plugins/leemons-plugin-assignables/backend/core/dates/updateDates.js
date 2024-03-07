const { pick, difference, keys, without } = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { getDates } = require('./getDates');
// const { unregisterDates } = require('./unregisterDates');
const { registerDates } = require('./registerDates');
const { unregisterDates } = require('./unregisterDates');

// TODO: Verify if updateDates function is expected to remove the dates which are not used, this bug comes from leemons legacy

function getDiff(oldObject, newObject) {
  const newKeys = difference(keys(newObject), keys(oldObject));
  const deletedKeys = difference(keys(oldObject), keys(newObject));

  const commonKeys = without(keys(oldObject), ...newKeys.concat(deletedKeys));

  const updatedKeys = commonKeys.filter((key) =>
    oldObject[key]
      ? new Date(oldObject[key]).getTime()
      : undefined !== newObject[key]
      ? new Date(newObject[key]).getTime()
      : undefined
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
 * @param {boolean} options.onlyAddDates
 * @param {object} ctx
 */
async function updateDates({ type, instance, dates, onlyAddDates, ctx }) {
  if (!type || !instance || !dates) {
    throw new LeemonsError(ctx, {
      message: 'Cannot update dates: type, instance and dates are required',
      httpStatusCode: 400,
    });
  }

  const currentDates = await getDates({ type, instance, ctx });
  const { added, deleted, updated } = getDiff(currentDates, dates);

  if ((deleted.length && !onlyAddDates) || updated.length) {
    await unregisterDates({ type, instance, name: updated, ctx });
    // await unregisterDates({ type, instance, name: deleted.concat(updated), ctx });
  }
  if (added.length || updated.length) {
    await registerDates({
      type,
      instance,
      dates: pick(dates, added, updated),
      ctx,
    });
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
