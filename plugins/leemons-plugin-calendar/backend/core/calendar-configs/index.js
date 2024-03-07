const { add } = require('./add');
const { list } = require('./list');
const { exist } = require('./exist');
const { detail } = require('./detail');
const { update } = require('./update');
const { remove } = require('./remove');
const { addEvent } = require('./addEvent');
const { updateEvent } = require('./updateEvent');
const { removeEvent } = require('./removeEvent');
const { getCalendars } = require('./getCalendars');
const { getByCenterId } = require('./getByCenterId');
const { getCentersWithOutAssign } = require('./getCentersWithOutAssign');

module.exports = {
  add,
  list,
  exist,
  detail,
  update,
  remove,
  addEvent,
  updateEvent,
  removeEvent,
  getCalendars,
  getByCenterId,
  getCentersWithOutAssign,
};
