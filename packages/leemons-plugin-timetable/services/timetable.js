const create = require('../src/services/timetables/create');
const get = require('../src/services/timetables/get');
const count = require('../src/services/timetables/count');
const deleteOne = require('../src/services/timetables/delete');

module.exports = {
  create,
  get,
  count,
  delete: deleteOne,
};
