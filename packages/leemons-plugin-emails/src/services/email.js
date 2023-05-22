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

  static async getProvider(value) {
    const providers = await value.services.email.getProviders();
    return {
      ...value.services.email.data,
      providerName: value.name,
      providers,
    };
  }

  /**
   * Return array of installed providers for email
   * @public
   * @static
   * @return {any[]}
   * */
  static async providers() {
    const providers = [];
    _.forIn(leemons.listProviders(), (value) => {
      if (
        value.services?.email?.data &&
        value.services.email &&
        _.isFunction(value.services.email.getProviders)
      ) {
        providers.push(Email.getProvider(value));
      }
    });

    return Promise.all(providers);
  }

  /**
   * Add new provider config
   * @public
   * @static
   * @return {Promise<any>} new provider config
   * */
  static async saveProvider(data) {
    if (!leemons.getProvider(data.providerName))
      throw new Error(`No provider with the name ${data.providerName}`);
    return leemons.getProvider(data.providerName).services.email.saveConfig(data.config);
  }

  /**
   * Remove provider config
   * @public
   * @static
   * @return {Promise<any>} new provider config
   * */
  static async removeProvider(data) {
    if (!leemons.getProvider(data.providerName))
      throw new Error(`No provider with the name ${data.providerName}`);
    return leemons.getProvider(data.providerName).services.email.removeConfig(data.id);
  }

  /**
   * Send test email to check if the transporter is working with the provided config
   * @private
   * @static
   * @return {Promise<any>} nodemailer transporters
   * */
  static async sendTest(data) {
    const providersByName = _.keyBy(leemons.listProviders(), 'name');
    if (!providersByName[data.providerName])
      throw new Error(`No provider with the name ${data.providerName}`);
    const transporter = providersByName[data.providerName].services.email.getTransporterByConfig(
      data.config
    );

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

    _.forIn(leemons.listProviders(), (value) => {
      if (
        value.services &&
        value.services.email &&
        _.isFunction(value.services.email.getTransporters)
      ) {
        promises.push(value.services.email.getTransporters());
      }
    });
    const transportersArray = await Promise.all(promises);
    const transporters = _.compact(_.flattenDeep(transportersArray));
    if (!sendMailTransporter) {
      sendMailTransporter = global.utils.nodemailer.createTransport({
        sendmail: true,
      });
      transporters.push(sendMailTransporter);
    }

    // console.log('-- EmailService > getTransporters:');
    // console.dir(transporters, { depth: null });

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
      if (detail) {
        return table.emailTemplateDetail.update(
          { template: template.id, language, type },
          {
            template: template.id,
            language,
            subject,
            html,
            type,
          },
          { transacting }
        );
        /*
        * throw new Error(
          `The ${templateName} email template already have the language ${language} of type ${type}`
        ); */
      }

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
  static async send(from, to, templateName, language, callbackLanguage, context = {}) {
    // Find email template
    let email = await Email.findEmail(templateName, language);
    if (!email) email = await Email.findEmail(templateName, callbackLanguage);
    if (!email) throw new Error(`No email found for template '${templateName}' and language `);
    // Take email settings and try to send email with each setting until it is sent.
    const transporters = await Email.getTransporters();
    if (!transporters.length) throw new Error('No email providers configured yet');

    context.__from = from;
    context.__to = to;
    context.__platformName = 'Leemons';
    context.__logoUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAlESURBVHgB7Z1bbBzVGcf/Z3aNqkDTRQRXkASPyYtxqGKjtomqOGyKaHmohKvmpVWrxE+lRarDA31ppcQCJC4PxEhcXiCOQPACwpGQkEDgDU7AAQQbQexECHkcCLdEYhyQlWS9ezjf8Y6z3ptnd2bOOWvPT9rseDyOvd//O9937ofBUGw7ncI18z3icotVsDo5eAcYswGeAkMKXLxKYXDFPVdcOfTOwGYKVmEa8ziBi8ms42RcGAiDIUiDr8n3W8DtnCFNtxAqLMvAswWwDPKXjzinJhwYgFYBil6+m3HWL75MQy0ZDjaiWwwtAti3bk8Lo++DeqNXh2OUcxxypsZHoRhlApR4+16EHl5CwxGlYr9z8p1DUIQSAW6+dcegSKL7KxKnuSgTIlIBiqHmIMz1+OWIXIhIBLC70jZL5h8XHt+PFYAw0kghnxuKIlknEDKbNu/YjURhVBi/ByuHHmYl+lPttuuemzmBEAmtBFCSta4u7BOxfi9WMKKBd6DQZg052XAadqEIIENOIj+G1o31jeLwfG5nGCHJQkDs7t/1iHj/MVaP8QnhcG1j9NkRkEACULxnLPFxC1Uvw8Smzy5zXgCaTsLFuv0zWOVwoD+1rmPWPX9mAk3QlADS+JwfQIyEMdzVrAgNC0BFLvb8SkiE69pt5/sGq6kN1YJkwqWYH1MTzvO9zuS7Wb/P+07CsqrJEq8ipi7CRmN21zbb9/N+HqJGFrt61VU1g+DwtkSvn8aarxJALVzExm8E28pJmy3LsknY7u7bI8rJw4hplG1+knLdELQKuxjCxhVdFr31uizqhiBh/P2IjR+EFLPaHq/3QM0SQKFH1G0PIiYwPM9Fx93RTLXvJWv9kDC+ryTSDFt/sw4vHdwOk5j44Dz+NnAUUcASclSws9r3qoYgmXgjDD1Tp2Zx4YccTOKV0TOIENu+pa/qOElVAaL0foKMH/EHbpjjH55HlDAL++yedEWvcYUAUXu/xxtvfw1TIGf48uwcIiaFS7k95TcrBIja+z2Oi5hLcdcEhp8+BRUwyxosv7dEAPtXfTSLwYYi/vv/j7Tnguee/1yF93vYdtf2dOmNJQKwPAKN7jQKffDhJ9V4X9Xf/9UcnnhK7e8XNaIlEWaxHVBs9U5DAy+KKuk2UTVVCZW8P+0aU+n9i4iOumu9jrorJcDKp6GJe/5zXHqjSh54+BMtxpeUJONFAUTyVRp+SiFvpEaQKhHu/99HeOWwvmqwSMZ3L17TPzrDTylrf96Gxx66DXf+/gZEAQn9T1HajhtQ+/LCkOyOTrVv7BclQPs8zkuXC3jt9bPyOuycQFXegXvek61wI8jPn3bPfZGVIYgxQxZKFBkWNZMdf3wjlNYyhTXyehnidMX8KlhI3E7vMgR1bt4uhhuZkZNpN6xfg8F/dWHrb9dhw41rfP0MhZpJ4ekkpAnhpgbO9MnxTkb9EyyX/x4tQHfXL7D11+ukKLeI61LOCu8mo0+enjWys68alAeSmKeloMYslqyLNLApMTwMLs73WOB8Jc3jby0YJwGYjRg9MGYnGVgHWgiK/ZQLyhPyhQu5lor/CwgB5LJ/w6EhzF1334Q777hBNtaWg/IEVWFpzOHsV+ZUPcthjHWwzs191AK2YSADf9+EwXu7fBm9Fi8LIag6aqgQDglAVVCjSgF5/GMP3iarm2FBIgw/pa/ruwYuCcBhEIP/7pKvKKCW8F9Fi9ik0hB4jViYPCo64qIyPkEliqbDrL8xvJIVFGMEIONToo0a00QwQgDyehXG9zBJBBJA605SfxGGjzLs1IJEoLEHzbhaBSAP1GF8DxpzGPjHJmiEBODaBCDjh1nVbPZvCNLOCAIHd6gvyIEGyPt39auL+7Ug42srBZzNWkKFGWhAZ+gphwTQUwqoBDDuQAOq5wHVg4wf1USAunApAPO9pjUsqKtBd+wv5w936BCAiUH5ZFK5AKYZn1iv42/6WTJrFafIOVDIm2+ZMzXdY+J91YP3LEu2ly1hXsARKIQGTEyZmu4x8sLnUAnt4kvvVvGrDBRjUtcwOYPqOUNyC2V4AlyVUL5jrFELNHQ4Q/6yjDpSgGIeyEAxJpQCGrpUPXlLtL0y3uJt68rNwmEohj74wefVxt5SaNqiquVJS7FGFq8W77W1jUADVAq+1DRCRatztMwXLYYfYlEAXWFI9doADxJexxoBznG4dO+IJQMynPEhaIC8UOUqGc0D9Eu2f6iYFNrZ3Tct7trQALWQab3YhghHqrQan8OZnhxfsmVBxX5BqfaNjIHdBQ1QOHrz7a9l51h32eznoHjrBHQuTeKM7S3fe7qiBBSnq9NkLa1zheRQ5b1dgUsDiUo1LXppnbJYxfuJihLgfuNcFKXgkq5S4DF1elYajfLD2rVtDXfgkbGfefYzDN7/Id459p1c/qSTat5P1FwYoDMXVIMEoMUZ1G1Mo2n0tTeIQsam11Rx/QC1sI1aGVPD+4naGzYtnH4xhpjAcLA9tU7hqDkvyPn0aIZOF0JMIOj0jXpHoNSdmMULifuged5QSyNCDx19Uu+RuttWuucdN3V9x7cmrCFuRSjxOlPH6o61LLtvqHvuTDb1y5uuFbWibYjxDed82Jkcf2S55/zNDU0m6QwwBzH+IFvNJff7edSXANRRJ/LBTsT5YHmE8Xkht9Pv6a3x9vUhE9n29QT9x6I7dQAxVSHbNGJ8ouETNGRSbt84q7urwjTEiOJ9zuTRhk8WaeoMGffcFxOxCFeQxj95rKkzdZo+RUmKcH3HzGpvIyyEncY93yPwLh0yMSPxqkkdd4pwRcLd2WjMLye8owyt/NiqEcGrappwlCHhnMo4/KpErxhTHsYKh1q4fC7RG9bRtqFvFCTPHQD2rcDSIEIORE1nfAQhEvp5wrKaet3Nh2Fx0X+0Qs4UZhjl+dyfnal3MwiZaI80b/XSQLHe4gNybCQilOxV1oJCuKJuP9Rs3b4RlG4WZ7wQCx5/AD8mD/ntTAuKlt365Db5eb6bMWZEI45mKwtLDEUZamqhdbtEaj/ITcOZEAMsDYUUjT6q0turYcx+lVfEoF18+RYW/kayjqhGZsT7EcwlRnUavRRjBCiHDhDFNbSnKbagYHUChQ7a304IY2Nh1l75zD0yqEie3F0YvbNmYBVoht8J4eVZUwxezk+aovin0zrCfQAAAABJRU5ErkJggg==';

    // Compile email with data
    email.subject = Sqrl.render(email.subject, context);
    email.html = Sqrl.render(email.html, context);

    // console.log('--- EmailService > send:');

    return Email.startToTrySendEmail(from, to, email, transporters, 0);
  }

  /**
   * Send custom test email to check if the transporter is working
   * @private
   * @static
   * @return {Promise<any>} nodemailer transporters
   * */
  static async sendCustomTest({ from, to, subject, body }) {
    const transporters = await Email.getTransporters();
    if (!transporters.length) throw new Error('No email providers configured yet');

    const context = {};
    context.__from = from;
    context.__to = to;
    context.__platformName = 'Leemons';
    context.__logoUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAlESURBVHgB7Z1bbBzVGcf/Z3aNqkDTRQRXkASPyYtxqGKjtomqOGyKaHmohKvmpVWrxE+lRarDA31ppcQCJC4PxEhcXiCOQPACwpGQkEDgDU7AAQQbQexECHkcCLdEYhyQlWS9ezjf8Y6z3ptnd2bOOWvPT9rseDyOvd//O9937ofBUGw7ncI18z3icotVsDo5eAcYswGeAkMKXLxKYXDFPVdcOfTOwGYKVmEa8ziBi8ms42RcGAiDIUiDr8n3W8DtnCFNtxAqLMvAswWwDPKXjzinJhwYgFYBil6+m3HWL75MQy0ZDjaiWwwtAti3bk8Lo++DeqNXh2OUcxxypsZHoRhlApR4+16EHl5CwxGlYr9z8p1DUIQSAW6+dcegSKL7KxKnuSgTIlIBiqHmIMz1+OWIXIhIBLC70jZL5h8XHt+PFYAw0kghnxuKIlknEDKbNu/YjURhVBi/ByuHHmYl+lPttuuemzmBEAmtBFCSta4u7BOxfi9WMKKBd6DQZg052XAadqEIIENOIj+G1o31jeLwfG5nGCHJQkDs7t/1iHj/MVaP8QnhcG1j9NkRkEACULxnLPFxC1Uvw8Smzy5zXgCaTsLFuv0zWOVwoD+1rmPWPX9mAk3QlADS+JwfQIyEMdzVrAgNC0BFLvb8SkiE69pt5/sGq6kN1YJkwqWYH1MTzvO9zuS7Wb/P+07CsqrJEq8ipi7CRmN21zbb9/N+HqJGFrt61VU1g+DwtkSvn8aarxJALVzExm8E28pJmy3LsknY7u7bI8rJw4hplG1+knLdELQKuxjCxhVdFr31uizqhiBh/P2IjR+EFLPaHq/3QM0SQKFH1G0PIiYwPM9Fx93RTLXvJWv9kDC+ryTSDFt/sw4vHdwOk5j44Dz+NnAUUcASclSws9r3qoYgmXgjDD1Tp2Zx4YccTOKV0TOIENu+pa/qOElVAaL0foKMH/EHbpjjH55HlDAL++yedEWvcYUAUXu/xxtvfw1TIGf48uwcIiaFS7k95TcrBIja+z2Oi5hLcdcEhp8+BRUwyxosv7dEAPtXfTSLwYYi/vv/j7Tnguee/1yF93vYdtf2dOmNJQKwPAKN7jQKffDhJ9V4X9Xf/9UcnnhK7e8XNaIlEWaxHVBs9U5DAy+KKuk2UTVVCZW8P+0aU+n9i4iOumu9jrorJcDKp6GJe/5zXHqjSh54+BMtxpeUJONFAUTyVRp+SiFvpEaQKhHu/99HeOWwvmqwSMZ3L17TPzrDTylrf96Gxx66DXf+/gZEAQn9T1HajhtQ+/LCkOyOTrVv7BclQPs8zkuXC3jt9bPyOuycQFXegXvek61wI8jPn3bPfZGVIYgxQxZKFBkWNZMdf3wjlNYyhTXyehnidMX8KlhI3E7vMgR1bt4uhhuZkZNpN6xfg8F/dWHrb9dhw41rfP0MhZpJ4ekkpAnhpgbO9MnxTkb9EyyX/x4tQHfXL7D11+ukKLeI61LOCu8mo0+enjWys68alAeSmKeloMYslqyLNLApMTwMLs73WOB8Jc3jby0YJwGYjRg9MGYnGVgHWgiK/ZQLyhPyhQu5lor/CwgB5LJ/w6EhzF1334Q777hBNtaWg/IEVWFpzOHsV+ZUPcthjHWwzs191AK2YSADf9+EwXu7fBm9Fi8LIag6aqgQDglAVVCjSgF5/GMP3iarm2FBIgw/pa/ruwYuCcBhEIP/7pKvKKCW8F9Fi9ik0hB4jViYPCo64qIyPkEliqbDrL8xvJIVFGMEIONToo0a00QwQgDyehXG9zBJBBJA605SfxGGjzLs1IJEoLEHzbhaBSAP1GF8DxpzGPjHJmiEBODaBCDjh1nVbPZvCNLOCAIHd6gvyIEGyPt39auL+7Ug42srBZzNWkKFGWhAZ+gphwTQUwqoBDDuQAOq5wHVg4wf1USAunApAPO9pjUsqKtBd+wv5w936BCAiUH5ZFK5AKYZn1iv42/6WTJrFafIOVDIm2+ZMzXdY+J91YP3LEu2ly1hXsARKIQGTEyZmu4x8sLnUAnt4kvvVvGrDBRjUtcwOYPqOUNyC2V4AlyVUL5jrFELNHQ4Q/6yjDpSgGIeyEAxJpQCGrpUPXlLtL0y3uJt68rNwmEohj74wefVxt5SaNqiquVJS7FGFq8W77W1jUADVAq+1DRCRatztMwXLYYfYlEAXWFI9doADxJexxoBznG4dO+IJQMynPEhaIC8UOUqGc0D9Eu2f6iYFNrZ3Tct7trQALWQab3YhghHqrQan8OZnhxfsmVBxX5BqfaNjIHdBQ1QOHrz7a9l51h32eznoHjrBHQuTeKM7S3fe7qiBBSnq9NkLa1zheRQ5b1dgUsDiUo1LXppnbJYxfuJihLgfuNcFKXgkq5S4DF1elYajfLD2rVtDXfgkbGfefYzDN7/Id459p1c/qSTat5P1FwYoDMXVIMEoMUZ1G1Mo2n0tTeIQsam11Rx/QC1sI1aGVPD+4naGzYtnH4xhpjAcLA9tU7hqDkvyPn0aIZOF0JMIOj0jXpHoNSdmMULifuged5QSyNCDx19Uu+RuttWuucdN3V9x7cmrCFuRSjxOlPH6o61LLtvqHvuTDb1y5uuFbWibYjxDed82Jkcf2S55/zNDU0m6QwwBzH+IFvNJff7edSXANRRJ/LBTsT5YHmE8Xkht9Pv6a3x9vUhE9n29QT9x6I7dQAxVSHbNGJ8ouETNGRSbt84q7urwjTEiOJ9zuTRhk8WaeoMGffcFxOxCFeQxj95rKkzdZo+RUmKcH3HzGpvIyyEncY93yPwLh0yMSPxqkkdd4pwRcLd2WjMLye8owyt/NiqEcGrappwlCHhnMo4/KpErxhTHsYKh1q4fC7RG9bRtqFvFCTPHQD2rcDSIEIORE1nfAQhEvp5wrKaet3Nh2Fx0X+0Qs4UZhjl+dyfnal3MwiZaI80b/XSQLHe4gNybCQilOxV1oJCuKJuP9Rs3b4RlG4WZ7wQCx5/AD8mD/ntTAuKlt365Db5eb6bMWZEI45mKwtLDEUZamqhdbtEaj/ITcOZEAMsDYUUjT6q0turYcx+lVfEoF18+RYW/kayjqhGZsT7EcwlRnUavRRjBCiHDhDFNbSnKbagYHUChQ7a304IY2Nh1l75zD0yqEie3F0YvbNmYBVoht8J4eVZUwxezk+aovin0zrCfQAAAABJRU5ErkJggg==';

    // Compile email with data
    const email = {};
    email.subject = subject;
    email.html = body;

    return Email.startToTrySendEmail(from, to, email, transporters, 0);
  }

  /**
   * Send email as platform
   * @public
   * @static
   * @param {string} to
   * @param {string} templateName
   * @param {string} language
   * @param {any} context
   * @return {Promise<boolean>}
   * */
  static async sendAsPlatform(to, templateName, language, context) {
    return Email.sendAsEducationalCenter(to, templateName, language, context);
  }

  /**
   * Send email as educational center
   * @public
   * @static
   * @param {string} to
   * @param {string} templateName
   * @param {string} language
   * @param {any} context
   * @param {string?} centerId
   * @return {Promise<boolean>}
   * */
  static async sendAsEducationalCenter(to, templateName, language, context = {}, centerId) {
    const userServices = leemons.getPlugin('users').services;

    let email = null;
    let locale = null;

    if (centerId) {
      const center = await userServices.centers.detail(centerId);
      if (center) {
        context.__center = center;
        if (center.email) email = center.email;
        if (center.locale) locale = center.locale;
      }
    }

    if (!email || !locale) {
      const [pEmail, pLocale] = await Promise.all([
        userServices.platform.getEmail(),
        userServices.platform.getDefaultLocale(),
      ]);
      if (!email) email = pEmail;
      if (!locale) locale = pLocale;
    }

    return Email.send(email, to, templateName, language, locale, context);
  }

  static async startToTrySendEmail(from, to, email, transporters, index) {
    if (index < transporters.length) {
      try {
        // console.log('--- EmailService > startToTrySendEmail:');
        // console.log('--> transporters length:', transporters.length);
        // console.log('--> index:', index);

        const transporter = transporters[index];

        if (!transporter) {
          throw new Error(`No existe un transporter para el index: ${index}`);
        }

        // console.log('--> transporter:');
        // console.dir(transporter, { depth: null });

        const receipts = {
          from: from || 'dev@leemons.io',
          to,
        };

        // console.log('--> receipts:');
        // console.dir(receipts, { depth: null });

        const info = await transporter.sendMail({
          ...receipts,
          subject: email.subject,
          html: email.html,
        });
        // console.log('--> Resultado email:', info);
        info.error = false;
        return info;
      } catch (err) {
        console.error('ERROR > Error email:', err);
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
      { columns: ['id', 'subject', 'html'] }
    );
  }
}

module.exports = Email;
