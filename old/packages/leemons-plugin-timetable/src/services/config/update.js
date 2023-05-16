const isEqual = require('lodash.isequal');
const entitiesFormat = require('../../helpers/config/entitiesFormat');
const timeToDayjs = require('../../helpers/dayjs/timeToDayjs');
const weekDays = require('../../helpers/dayjs/weekDays');
const createBreaks = require('./breakes/create');
const deleteBreaks = require('./breakes/delete');
const get = require('./get');

const configTable = leemons.query('plugins_timetable::config');

module.exports = async function update(
  { entities: entitiesObj, start, end, days, breaks, slot } = {},
  { transacting: t } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const data = {};

      // Get the current config
      const config = await get(entitiesObj, { transacting });

      // Check if the config exists
      if (!config) {
        throw new Error('Config not found');
      }

      let startTime;
      let endTime;

      // If start is set, validate it
      if (start && start !== config.start) {
        startTime = timeToDayjs(start);

        if (!startTime) {
          throw new Error('Invalid start time');
        }

        data.start = startTime.format('HH:mm');
      } else {
        startTime = timeToDayjs(config.start);
      }

      // If end is set, validate it (must be after start)
      if (end && end !== config.end) {
        endTime = timeToDayjs(end);

        if (!endTime) {
          throw new Error('Invalid end time');
        }

        if (endTime.isBefore(startTime)) {
          throw new Error('End time must be after start time');
        }

        data.end = endTime.format('HH:mm');
      }

      // If slot is set, validate it
      if (slot && slot !== config.slot) {
        // Check if slot is an integer.
        if (!Number.isInteger(slot)) {
          throw new Error('Slot must be an integer.');
        }
        data.slot = slot;
      }

      // If days are set, validate them
      if (days) {
        // Check if days is an array.
        if (!Array.isArray(days)) {
          throw new Error('Days must be an array.');
        }

        const lowercasedDays = days.map((day) => day.toLowerCase());
        // Check if days are in the weekdays.
        if (lowercasedDays.some((day) => !weekDays.includes(day))) {
          throw new Error('Days must be valid weekdays.');
        }

        if (lowercasedDays.some((day) => !config.days.includes(day))) {
          data.days = lowercasedDays.join(',');
        }
      }

      // Validate breaks if set
      // TODO: Only update breaks if they are different
      if (breaks && !isEqual(breaks, config.breaks)) {
        // Check if breaks is an array.
        if (!Array.isArray(breaks)) {
          throw new Error('Breaks must be an array.');
        }

        // Check breaks names.
        if (breaks.some(({ name }) => typeof name !== 'string' || !name)) {
          throw new Error('Breaks names must be strings.');
        }

        // Check if breaks are valid.
        if (
          breaks.some((breakObj) => {
            const breakStartTime = timeToDayjs(breakObj.start);
            const breakEndTime = timeToDayjs(breakObj.end);

            return (
              breakStartTime.isAfter(breakEndTime) ||
              breakStartTime.isBefore(startTime) ||
              breakEndTime.isAfter(endTime)
            );
          })
        ) {
          throw new Error('Breaks end time must be after start time and in class hours.');
        }

        // Delete the previous breaks
        await deleteBreaks({ configId: config.id }, { transacting });

        // Create the new breaks
        await createBreaks(config, breaks, { transacting });
      }

      // Update the entity only if there is something to update
      if (!isEqual(data, {})) {
        const { entities, entityTypes } = entitiesFormat(entitiesObj);
        const newConfig = await configTable.update({ entities, entityTypes }, data, {
          transacting,
        });
        return { ...newConfig, breaks: breaks || config.breaks };
      }
      return config;
    },
    t,
    configTable
  );
};
