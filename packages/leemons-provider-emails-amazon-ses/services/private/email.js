const _ = require('lodash');
const { htmlToText } = require('nodemailer-html-to-text');
const inlineBase64 = require('nodemailer-plugin-inline-base64');

let _transporters = null;

const table = {
  config: leemons.query('providers_emails-amazon-ses::config'),
};

class Email {
  static async saveConfig(config) {
    if (config.id) {
      return table.config.update({ id: config.id }, config);
    }
    return table.config.create(config);
  }

  static async removeConfig(id) {
    return table.config.delete({ id });
  }

  static async getProviders() {
    return table.config.find();
  }

  static async getTransporters() {
    if (!_transporters) {
      const configs = await table.config.find();
      if (!configs.length) return null;
      _transporters = _.map(configs, (config) => Email.getTransporterByConfig(config));
    }
    return _transporters;
  }

  static getTransporterByConfig(config) {
    const ses = new global.utils.aws.SES({
      apiVersion: '2010-12-01',
      region: config.region,
      accessKeyId: config.accessKey,
      secretAccessKey: config.secretAccessKey,
    });
    const transporter = global.utils.nodemailer.createTransport({
      SES: { ses, aws: global.utils.aws },
    });
    transporter.use('compile', htmlToText());
    transporter.use('compile', inlineBase64());
    return transporter;
  }
}

module.exports = Email;
