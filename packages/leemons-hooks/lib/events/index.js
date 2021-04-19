const chalk = require('chalk');
const { getActions } = require('../actions');
const { getFilters } = require('../filters');

async function fireEvent(eventName, ...args) {
  // Execute all the filters in order, wait for promises to resolve if exists
  const filteredArgs = await getFilters(eventName).reduce(
    async (params, func) => func(...(await params)),
    args
  );
  await Promise.all(
    getActions(eventName).map(async (f, i) => {
      console.log(`function ${i} called`);
      return f(...filteredArgs);
    })
  );

  console.log(
    chalk`The event {green ${eventName}} was fired with: {magenta %d Filters} and {cyan %d Actions}`,
    getFilters(eventName).length,
    getActions(eventName).length
  );

  return filteredArgs;
}

module.exports = { fireEvent };
