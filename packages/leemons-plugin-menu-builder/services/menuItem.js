const {
  add,
  exist,
  remove,
  removeAll,
  update,
  addCustomForUser,
} = require('../src/services/menu-item');
const _ = require('lodash');

module.exports = {
  add,
  remove,
  removeAll,
  exist,
  update,
  addCustomForUser,
  // TODO Mirar si los plugins deberian de poder añadir a los usuarios items customs
  addCustomForUserWithProfile: async (...props) => {
    // TODO Chapuza que te cagas
    return leemons.getPlugin('users').services.users.addMenuItemCustomForUserWithProfile(...props);
  },
};
