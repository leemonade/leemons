const _ = require('lodash');
const { htmlToText } = require('nodemailer-html-to-text');
const inlineBase64 = require('nodemailer-plugin-inline-base64');
const Sqrl = require('squirrelly');

const constants = require('../../config/constants');

const table = {
  emails: leemons.query('plugins_emails::emails'),
  emailsConfig: leemons.query('plugins_emails::emails-config'),
};

let _transporters = null;

class Email {
  static async init() {
    await Email.registerConfig({
      transport: 'smtp',
      name: 'Test smtp',
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      user: 'lavern48@ethereal.email',
      pass: 'km6a5jmjRy3QGMzb8W',
    });
    await Email.register(
      'Tes email',
      'test-mail',
      'es',
      'El asunto de prueba {name}',
      '<p>Hola <b>{name}</b></p>'
    );
  }

  /**
   * Create the nodemailer smtp transporter
   * @private
   * @static
   * @param {EmailConfig} config
   * @return {Promise<any>}
   * */
  static createSMTPTransport(config) {
    const transporter = global.utils.nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
    transporter.use('compile', htmlToText());
    transporter.use('compile', inlineBase64());
    return transporter;
  }

  static createMailchimpTransport(config) {
    return true;
  }

  /**
   * Create the nodemailer transporters
   * @private
   * @static
   * @return {Promise<any>}
   * */
  static async createTransporters() {
    const emailConfigs = await table.emailsConfig.find();
    _transporters = _.map(emailConfigs, (emailConfig) => {
      switch (emailConfig.transport.toLowerCase()) {
        case 'smtp':
          return Email.createSMTPTransport(emailConfig);
        case 'mailchimp':
          return Email.createMailchimpTransport(emailConfig);
        default:
          return Email.createSMTPTransport(emailConfig);
      }
    });
  }

  /**
   * Return the nodemailer transporters
   * @private
   * @static
   * @return {Promise<any>} nodemailer transporters
   * */
  static async getTransporters() {
    if (!_transporters) await Email.createTransporters();
    return _transporters;
  }

  /**
   * Remove one smtp config
   * @public
   * @static
   * @param {string} configId
   * @return {Promise<EmailConfig>}
   * */
  static async removeConfig(configId) {
    return table.emailsConfig.delete({ id: configId });
  }

  /**
   * Register new smtp config
   * @public
   * @static
   * @param {EmailConfig} config
   * @return {Promise<EmailConfig>}
   * */
  static async registerConfig(config) {
    return table.emailsConfig.create(config);
  }

  /**
   * Send email
   * @public
   * @static
   * @param {string} name
   * @param {string} templateName
   * @param {string} subject
   * @param {string} language
   * @param {string} html
   * @return {Promise<Email>}
   * */
  static async register(name, templateName, language, subject, html) {
    const exists = await table.emails.count({ templateName, language });
    if (exists) throw new Error('An email with this template name and language already exists');
    return table.emails.create({ name, templateName, language, subject, html });
  }

  /**
   * Send email
   * @public
   * @static
   * @param {string} templateName
   * @param {string} language
   * @return {Promise<Email>}
   * */
  static async remove(templateName, language) {
    return table.emails.remove({ templateName, language });
  }

  /**
   * Send email
   * @public
   * @static
   * @param {string} templateName
   * @return {Promise<Email>}
   * */
  static async removeAll(templateName) {
    return table.emails.remove({ templateName });
  }

  /**
   * Send email
   * @public
   * @static
   * @param {string} from
   * @param {string} to
   * @param {string} templateName
   * @param {string} language
   * @param {string} callbackLanguage
   * @param {any} context
   * @return {Promise<boolean>}
   * */
  static async send(from, to, templateName, language, callbackLanguage, context) {
    // Find email template
    let email = await Email.findEmail(templateName, language);
    if (!email) email = await Email.findEmail(templateName, callbackLanguage);
    if (!email) throw new Error(`No email found for template '${templateName}' and language `);
    // Take email settings and try to send email with each setting until it is sent.
    const transporters = await Email.getTransporters();
    return Email.startToTrySendEmail(from, to, email, context, transporters, 0);
  }

  static async startToTrySendEmail(from, to, email, context, transporters, index) {
    if (index < transporters.length) {
      let info = await transporters[index].sendMail({
        from,
        to,
        subject: email.subject,
        html: email.html,
      });
      console.log(info);
    }
    return { error: true, done: false };
  }

  /**
   * Get email
   * @private
   * @static
   * @param {Email} email
   * @param {any} transporter - Nodemailer transporter
   * @return {Promise<boolean>}
   * */
  static async sendEmail(email, transporter) {}

  /**
   * Get email
   * @private
   * @static
   * @param {string} templateName
   * @param {string} language
   * @return {Promise<Email>}
   * */
  static async findEmail(templateName, language) {
    return table.emails.findOne(
      {
        templateName,
        language,
      },
      { columns: ['subject', 'html'] }
    );
  }
}

module.exports = Email;
