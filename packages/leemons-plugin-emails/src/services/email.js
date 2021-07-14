const _ = require('lodash');
const Sqrl = require('squirrelly');

const testTemplate = require('../../emails/test');

const table = {
  emailTemplate: leemons.query('plugins_emails::email-template'),
  emailTemplateDetail: leemons.query('plugins_emails::email-template-detail'),
};

let sendMailTransporter = null;

class Email {
  static get types() {
    return {
      active: 'active',
    };
  }

  static async init() {
    await Email.addIfNotExist(
      'test-email',
      'es',
      'Email de prueba',
      testTemplate.es,
      Email.types.active
    );
    await Email.addIfNotExist(
      'test-email',
      'en',
      'Test email',
      testTemplate.en,
      Email.types.active
    );
  }

  /**
   * Return array of installed providers for email
   * @public
   * @static
   * @return {any[]}
   * */
  static providers() {
    const providers = [];
    let newValue;
    _.forIn(leemons.plugin.providers, (value, key) => {
      newValue = value;
      if (newValue.config && newValue.config.data) {
        newValue.config.data.providerName = key;
        providers.push(newValue.config.data);
      }
    });
    return providers;
  }

  /**
   * Add new provider config
   * @public
   * @static
   * @return {Promise<any>} new provider config
   * */
  static async addProvider(data) {
    if (!leemons.plugin.providers[data.providerName])
      throw new Error(`No provider with the name ${data.providerName}`);
    return leemons.plugin.providers[data.providerName].services.email.addConfig(data.config);
  }

  /**
   * Send test email to check if the transporter is working with the provided config
   * @private
   * @static
   * @return {Promise<any>} nodemailer transporters
   * */
  static async sendTest(data) {
    if (!leemons.plugin.providers[data.providerName])
      throw new Error(`No provider with the name ${data.providerName}`);
    const transporter = leemons.plugin.providers[
      data.providerName
    ].services.email.getTransporterByConfig(data.config);

    // TODO Email Sacar idioma principal seleccionado
    const language = 'es';
    let email = await Email.findEmail('test-email', language);
    if (!email) email = await Email.findEmail('test-email', 'en');

    // Compile email with data
    email.subject = Sqrl.render(email.subject, { name: 'Cerberupo' });
    email.html = Sqrl.render(email.html, { name: 'Cerberupo' });

    // TODO Cambiar emails por el del super admin para recibir el email y el del colegio para from
    return Email.startToTrySendEmail(
      'jaime@leemons.io',
      'jaime@leemons.io',
      email,
      [transporter],
      0
    );
  }

  /**
   * Return the nodemailer transporters for all installed providers
   * @private
   * @static
   * @return {Promise<any>} nodemailer transporters
   * */
  static async getTransporters() {
    const promises = [];
    _.forIn(leemons.plugin.providers, (value) => {
      if (
        value.services &&
        value.services.email &&
        _.isFunction(value.services.email.getTransporters)
      ) {
        promises.push(value.services.email.getTransporters());
      }
    });
    const transportersArray = await Promise.all(promises);
    const transporters = _.flatten(transportersArray);
    if (!sendMailTransporter)
      sendMailTransporter = global.utils.nodemailer.createTransport({
        sendmail: true,
      });
    transporters.push(sendMailTransporter);
    return transporters;
  }

  /**
   * Add email if not exist
   * @public
   * @static
   * @param {string} templateName
   * @param {string} subject
   * @param {string} language
   * @param {string} html
   * @param {string} type
   * @return {Promise<boolean>}
   * */
  static async addIfNotExist(templateName, language, subject, html, type) {
    try {
      await Email.add(templateName, language, subject, html, type);
      return true;
    } catch (err) {
      return true;
    }
  }

  /**
   * Add email
   * @public
   * @static
   * @param {string} templateName
   * @param {string} subject
   * @param {string} language
   * @param {string} html
   * @param {string} type
   * @return {Promise<Email>}
   * */
  static async add(templateName, language, subject, html, type) {
    let template = await table.emailTemplate.findOne({ templateName }, { columns: ['id'] });
    return table.emailTemplate.transaction(async (transacting) => {
      if (!template)
        template = await table.emailTemplate.create(
          {
            name: templateName,
            templateName,
          },
          { transacting }
        );
      const detail = await table.emailTemplateDetail.count(
        {
          template: template.id,
          language,
          type,
        },
        { transacting }
      );
      if (detail)
        throw new Error(
          `The ${templateName} email template already have the language ${language} of type ${type}`
        );
      leemons.log.info(
        `Adding email template Name: ${templateName} Language: ${language} Type: ${type}`
      );
      return table.emailTemplateDetail.create(
        {
          template: template.id,
          language,
          subject,
          html,
          type,
        },
        { transacting }
      );
    });
  }

  /**
   * Delete one template for one language
   * @public
   * @static
   * @param {string} templateName
   * @param {string} language
   * @param {string} type
   * @return {Promise<Email>}
   * */
  static async delete(templateName, language, type) {
    const template = await table.emailTemplate.findOne({ templateName }, { columns: ['id'] });
    if (!template) throw new Error(`There is no template with the name ${templateName}`);
    const templateDetail = await table.emailTemplateDetail.findOne(
      {
        template: template.id,
        language,
        type,
      },
      { columns: ['id'] }
    );
    if (!templateDetail)
      throw new Error(
        `The ${templateName} email template does not have the language ${language} of type ${type}`
      );
    return table.emailTemplateDetail.delete({ id: templateDetail.id });
  }

  /**
   * Delete all data of one template
   * @public
   * @static
   * @param {string} templateName
   * @return {Promise<Email>}
   * */
  static async deleteAll(templateName) {
    const template = await table.emailTemplate.findOne({ templateName }, { columns: ['id'] });
    if (!template) throw new Error(`There is no template with the name ${templateName}`);

    return table.emailTemplate.transaction(async (transacting) => {
      const value = await Promise.all([
        table.emailTemplate.delete({ id: template.id }, { transacting }),
        table.emailTemplateDetail.deleteMany({ template: template.id }, { transacting }),
      ]);
      return value[0];
    });
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
    if (!transporters.length) throw new Error('No email providers configured yet');

    // Compile email with data
    email.subject = Sqrl.render(email.subject, context);
    email.html = Sqrl.render(email.html, context);

    return Email.startToTrySendEmail(from, to, email, transporters, 0);
  }

  /**
   * Send email as educational center
   * @public
   * @static
   * @param {string} to
   * @param {string} templateName
   * @param {string} language
   * @param {any} context
   * @return {Promise<boolean>}
   * */
  static async sendAsEducationalCenter(to, templateName, language, context) {
    // TODO Sacar email del centro para mandar como from
    // TODO Sacar email del centro para mandar como from
    const centerEmail = 'jaime@leemons.io';
    const centerLanguage = 'es-ES';
    return Email.send(centerEmail, to, templateName, language, centerLanguage, context);
  }

  static async startToTrySendEmail(from, to, email, transporters, index) {
    if (index < transporters.length) {
      try {
        const info = await transporters[index].sendMail({
          from,
          to,
          subject: email.subject,
          html: email.html,
        });
        info.error = false;
        return info;
      } catch (err) {
        return Email.startToTrySendEmail(from, to, email, transporters, index + 1);
      }
    }
    return { error: true, message: 'Could not send email with any provider' };
  }

  /**
   * Get email
   * @private
   * @static
   * @param {string} templateName
   * @param {string} language
   * @return {Promise<Email>}
   * */
  static async findEmail(templateName, language) {
    const template = await table.emailTemplate.findOne({ templateName }, { columns: ['id'] });
    if (!template) throw new Error(`There is no template with the name ${templateName}`);
    return table.emailTemplateDetail.findOne(
      {
        template: template.id,
        language,
        type: Email.types.active,
      },
      { columns: ['subject', 'html'] }
    );
  }
}

module.exports = Email;
