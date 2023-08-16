const LeemonsError = require('leemons-error');

const { exist: existEvent } = require('../core/events/exist');
const { exist: existCalendar } = require('../core/calendar/exist');
const { exist: existEventType } = require('../core/event-types/exist');
const { exist: existCalendarConfig } = require('../core/calendar-configs/exist');
const { existByKey: existCalendarByKey } = require('../core/calendar/existByKey');

async function validateExistCalendarKey({ key, ctx }) {
  if (await existCalendarByKey(key))
    throw new LeemonsError(ctx, { message: `Calendar '${key}' already exists` });
}

async function validateNotExistCalendarKey({ key, ctx }) {
  if (!(await existCalendarByKey({ key, ctx })))
    throw new LeemonsError(ctx, { message: `Calendar '${key}' not exists` });
}

async function validateExistCalendar({ id, ctx }) {
  if (await existCalendar({ id, ctx }))
    throw new LeemonsError(ctx, { message: `Calendar '${id}' already exists` });
}

async function validateNotExistCalendar({ id, ctx }) {
  if (!(await existCalendar({ id, ctx })))
    throw new LeemonsError(ctx, { message: `Calendar '${id}' not exists` });
}

async function validateExistEvent({ id, ctx }) {
  if (await existEvent({ id, ctx }))
    throw new LeemonsError(ctx, { message: `Event '${id}' already exists` });
}

async function validateNotExistEvent({ id, ctx }) {
  if (!(await existEvent({ id, ctx })))
    throw new LeemonsError(ctx, { message: `Event '${id}' not exists` });
}

async function validateExistEventTypeKey({ key, ctx }) {
  if (await existEventType({ key, ctx }))
    throw new LeemonsError(ctx, { message: `Event type '${key}' already exists` });
}

async function validateNotExistEventTypeKey({ key, ctx }) {
  if (!(await existEventType({ key, ctx })))
    throw new LeemonsError(ctx, { message: `Event type '${key}' not exists` });
}

async function validateExistCalendarConfig({ id, ctx }) {
  if (await existCalendarConfig({ id, ctx }))
    throw new LeemonsError(ctx, { message: `Calendar config '${id}' already exists` });
}

async function validateNotExistCalendarConfig({ id, ctx }) {
  if (!(await existCalendarConfig({ id, ctx })))
    throw new LeemonsError(ctx, { message: `Calendar config '${id}' not exists` });
}

function validateKeyPrefix({ key, calledFrom, ctx }) {
  if (!key.startsWith(calledFrom))
    throw new LeemonsError(ctx, { message: `The key must begin with ${calledFrom}` });
}

function validateSectionPrefix({ key, calledFrom, ctx }) {
  if (!key.startsWith(calledFrom))
    throw new LeemonsError(ctx, { message: `The section must begin with ${calledFrom}` });
}

module.exports = {
  validateKeyPrefix,
  validateExistEvent,
  validateNotExistEvent,
  validateExistCalendar,
  validateSectionPrefix,
  validateNotExistCalendar,
  validateExistCalendarKey,
  validateExistEventTypeKey,
  validateNotExistCalendarKey,
  validateExistCalendarConfig,
  validateNotExistEventTypeKey,
  validateNotExistCalendarConfig,
};
