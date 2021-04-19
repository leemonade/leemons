// const chalk = require('chalk');
const { getActions } = require('../actions');
const { getFilters } = require('../filters');

async function fireEvent(eventName, ...args) {
  // Execute all the filters in order, wait for promises to resolve if exists
  const filteredArgs = await [...getFilters(eventName), ...getFilters('*')].reduce(
    async (params, func) => func(eventName, ...(await params)),
    args
  );
  await Promise.all(
    [...getActions(eventName), ...getActions('*')].map(async (f) => f(eventName, ...filteredArgs))
  );

  // console.log(
  //   chalk`The event {green ${eventName}} was fired with: {magenta %d Filters} and {cyan %d Actions}`,
  //   [...getFilters(eventName), ...getFilters('*')].length,
  //   [...getActions(eventName), ...getActions('*')].length
  // );

  return filteredArgs;
}

module.exports = { fireEvent };
