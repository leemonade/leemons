const _ = require('lodash');
const entitiesFormat = require('../helpers/config/entitiesFormat');
const timeToDayjs = require('../helpers/dayjs/timeToDayjs');
const weekDays = require('../helpers/dayjs/weekDays');
const createBreaks = require('./breakes/create');
const deleteBreaks = require('./breakes/delete');
const get = require('./get');
const { LeemonsError } = require('leemons-error');

module.exports = async function update({
  entities: entitiesObj,
  start,
  end,
  days,
  breaks,
  slot,
  ctx,
}) {
  const data = {};

  // Get the current config
  const config = await get({ entitiesObj, ctx });

  // Check if the config exists
  if (!config) {
    throw new LeemonsError(ctx, { message: 'Config not found' });
  }

  let startTime;
  let endTime;

  // If start is set, validate it
  if (start && start !== config.start) {
    startTime = timeToDayjs(start);

    if (!startTime) {
      throw new LeemonsError(ctx, { message: 'Invalid start time' });
    }

    data.start = startTime.format('HH:mm');
  } else {
    startTime = timeToDayjs(config.start);
  }

  // If end is set, validate it (must be after start)
  if (end && end !== config.end) {
    endTime = timeToDayjs(end);

    if (!endTime) {
      throw new LeemonsError(ctx, { message: 'Invalid end time' });
    }

    if (endTime.isBefore(startTime)) {
      throw new LeemonsError(ctx, { message: 'End time must be after start time' });
    }

    data.end = endTime.format('HH:mm');
  }

  // If slot is set, validate it
  if (slot && slot !== config.slot) {
    // Check if slot is an integer.
    if (!Number.isInteger(slot)) {
      throw new LeemonsError(ctx, { message: 'Slot must be an integer.' });
    }
    data.slot = slot;
  }

  // If days are set, validate them
  if (days) {
    // Check if days is an array.
    if (!Array.isArray(days)) {
      throw new LeemonsError(ctx, { message: 'Days must be an array.' });
    }

    const lowercasedDays = days.map((day) => day.toLowerCase());
    // Check if days are in the weekdays.
    if (lowercasedDays.some((day) => !weekDays.includes(day))) {
      throw new LeemonsError(ctx, { message: 'Days must be valid weekdays.' });
    }

    if (lowercasedDays.some((day) => !config.days.includes(day))) {
      data.days = lowercasedDays.join(',');
    }
  }

  // Validate breaks if set
  // TODO: Only update breaks if they are different
  if (breaks && !_.isEqual(breaks, config.breaks)) {
    // Check if breaks is an array.
    if (!Array.isArray(breaks)) {
      throw new LeemonsError(ctx, { message: 'Breaks must be an array.' });
    }

    // Check breaks names.
    if (breaks.some(({ name }) => typeof name !== 'string' || !name)) {
      throw new LeemonsError(ctx, { message: 'Breaks names must be strings.' });
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
      throw new LeemonsError(ctx, {
        message: 'Breaks end time must be after start time and in class hours.',
      });
    }

    // Delete the previous breaks
    await deleteBreaks({ configId: config.id }, { transacting });

    // Create the new breaks
    await createBreaks({ config, breaks, ctx });
  }

  // Update the entity only if there is something to update
  if (!_.isEqual(data, {})) {
    const { entities, entityTypes } = entitiesFormat({ entitiesObj, ctx });
    const newConfig = await ctx.tx.db.Config.findOneAndUpdate({ entities, entityTypes }, data, {
      lean: true,
      new: true,
    });
    return { ...newConfig, breaks: breaks || config.breaks };
  }
  return config;
};
