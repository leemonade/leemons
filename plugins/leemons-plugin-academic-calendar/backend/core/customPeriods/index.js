const { create } = require('./create');
const getMethods = require('./get');
const { remove } = require('./remove');
const { update } = require('./update');

module.exports = { ...getMethods, remove, update, create };
