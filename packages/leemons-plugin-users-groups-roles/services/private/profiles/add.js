const { existName } = require('./existName');
const { table } = require('../tables');

async function add(data) {
  const exist = await existName(data.name);
  if (exist) throw new Error(`Already exists one profile with the name '${data.name}'`);
}

module.exports = { add };
