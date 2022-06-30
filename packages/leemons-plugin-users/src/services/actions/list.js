const { table } = require('../tables');

/**
 * Return all action in bbdd
 * @public
 * @static
 * */
async function list() {
  return table.actions.find({ $sort: 'order:ASC' });
}

module.exports = { list };
