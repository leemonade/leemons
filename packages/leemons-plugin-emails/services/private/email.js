const _ = require('lodash');
const constants = require('../../config/constants');

const table = {
  emails: leemons.query('plugins_users-groups-roles::emails'),
};

class Email {
  static async init() {}

  /**
   * Send email
   * @public
   * @static
   * @param {string} data
   * @return {Promise<any>}
   * */
  static async send(data) {
    return true;
  }
}

module.exports = Email;
