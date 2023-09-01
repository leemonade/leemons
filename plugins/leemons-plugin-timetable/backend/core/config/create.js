const timeToDayjs = require('../helpers/dayjs/timeToDayjs');
const weekDays = require('../helpers/dayjs/weekDays');
const has = require('./has');
const createBreaks = require('./breakes/create');
const entitiesFormat = require('../helpers/config/entitiesFormat');
const { LeemonsError } = require('leemons-error');

module.exports = async function create({
  entities: entitiesObj,
  start,
  end,
  days,
  breaks,
  slot,
  ctx,
}) {
  // Validate data types
  if (!entitiesObj || !start || !end || !days || !breaks || !slot) {
    throw new LeemonsError(ctx, { message: 'Missing parameters' });
  }

  if (!Array.isArray(days)) {
    throw new LeemonsError(ctx, { message: 'Days must be an array' });
  }

  if (typeof slot !== 'number') {
    throw new LeemonsError(ctx, { message: 'Slot must be a number' });
  }

  if (slot <= 0) {
    throw new LeemonsError(ctx, { message: 'Slot must be a positive number' });
  }

  if (slot % 1 !== 0) {
    throw new LeemonsError(ctx, { message: 'Slot must be an integer' });
  }

  const startTime = timeToDayjs(start);
  const endTime = timeToDayjs(end);

  if (!startTime) {
    throw new LeemonsError(ctx, { message: 'Start time is invalid, must be HH:mm' });
  }

  if (!endTime) {
    throw new LeemonsError(ctx, { message: 'End time is invalid, must be HH:mm' });
  }

  if (startTime.isAfter(endTime)) {
    throw new LeemonsError(ctx, { message: 'Start time must be before end time' });
  }

  const lowercasedDays = [...new Set(days.map((day) => day.toLowerCase()))];

  if (lowercasedDays.some((day) => !weekDays.includes(day))) {
    throw new LeemonsError(ctx, { message: 'Invalid day' });
  }

  // Validate entities
  const { entityTypes, entities } = entitiesFormat({ entitiesObj, ctx });

  // Check if the timetable config already exists.
  if (await has({ entitiesObj, ctx })) {
    throw new LeemonsError(ctx, { message: 'Timetable config already exists' });
  }

  // Create config
  let config = await ctx.tx.db.Config.create({
    entityTypes,
    entities,
    start,
    end,
    days: lowercasedDays.join(','),
    slot,
  });
  config = config.toObject();

  // Register breaks
  const _breaks = await createBreaks({ config, breaks, ctx });

  return { ...config, breaks: _breaks };
};
