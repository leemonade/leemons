// const chalk = require('chalk');
const { getActions } = require('../actions');
const { getFilters } = require('../filters');

async function fireEvent(eventName, ...args) {
  // Execute all the filters in order, wait for promises to resolve if exists
  const filteredArgs = await [...getFilters(eventName), ...getFilters('*')].reduce(
    async (params, func) => func({ eventName, args: await params }),
    args
  );
  await Promise.all(
    [...getActions(eventName), ...getActions('*')].map(async (f) =>
      f({ eventName, args: filteredArgs })
    )
  );

  return filteredArgs;
}

module.exports = { fireEvent };
