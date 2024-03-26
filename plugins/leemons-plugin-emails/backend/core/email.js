/**
 * @typedef {import('@leemons/emails').EmailTemplate} EmailTemplate
 */

const _ = require('lodash');
const Sqrl = require('squirrelly');

const { getPluginProviders, getPluginProvider } = require('@leemons/providers');
const { LeemonsError } = require('@leemons/error');
const { getEmailTypes } = require('@leemons/emails');
const nodemailer = require('nodemailer');
const testTemplate = require('../emails/test');

/**
 * @typedef {Object} EmailTemplateParams
 * @property {MoleculerContext} ctx
 * @property {string} templateName
 * @property {string} language
 * @property {string} subject
 * @property {string} html
 * @property {string} type
 */

class Email {
  static async init() {
    await Email.addIfNotExist(
      'test-email',
      'es',
      'Email de prueba',
      testTemplate.es,
      getEmailTypes().active
    );
    await Email.addIfNotExist(
      'test-email',
      'en',
      'Test email',
      testTemplate.en,
      getEmailTypes().active
    );
  }

  /**
   * Get the provider details for a given plugin key value.
   *
   * @param {Object} params An object containing the necessary parameters.
   * @param {string} params.pluginKeyValue The key value of the plugin.
   * @param {MoleculerContext} params.ctx Moleculer's Context.
   * @returns {Promise<Object>} A promise that resolves with the provider details.
   */
  static async getProvider({ pluginKeyValue, ctx }) {
    const providers = await ctx.tx.call(`${pluginKeyValue.pluginName}.email.getProviders`);
    return {
      ...pluginKeyValue.params,
      providerName: pluginKeyValue.pluginName,
      providers,
    };
  }

  /**
   * Returns a promise that resolves with an array of promises, each corresponding to a specific email provider.
   * Each element in the array is the result of calling `getProvider` with the context (`ctx`) and the `pluginKeyValue` for each provider.
   * This means the final result is an array of objects, where each object contains details about a specific email provider,
   * including the provider name and the providers available under that name.
   *
   * @param {Object} params Parameters for getting the providers
   * @param {MoleculerContext} params.ctx Moleculer's Context
   * @public
   * @static
   * @returns {Promise<any[]>} A promise that resolves with an array of installed email providers.
   */
  static async providers({ ctx }) {
    const providers = [];
    const plugins = await getPluginProviders({ keyValueModel: ctx.tx.db.KeyValue, raw: true });
    _.forIn(plugins, (value) => {
      providers.push(Email.getProvider({ pluginKeyValue: value, ctx }));
    });
    return Promise.all(providers);
  }

  /**
   * Returns a promise that resolves with a flattened array of all available providers.
   * It first calls the `providers` function to get the providers, then iterates over each provider and their respective available providers
   * to create a new object that combines the provider details with the details of each available provider.
   * This results in an array of objects, where each object represents a specific available provider,
   * including both the general provider details and the specific available provider details.
   *
   * This function provides a more granular level of detail, combining information from general providers with that of specific available providers,
   * useful when detailed information about all specific available providers is needed.
   *
   * @param {Object} params The parameters object.
   * @param {MoleculerContext} params.ctx Moleculer's Context.
   * @returns {Promise<any[]>} A promise that resolves with a flattened array of all available email providers.
   */
  static async providersArray({ ctx }) {
    const _providers = await Email.providers({ ctx });
    const result = [];
    _.forEach(_providers, ({ providers, ...data }) => {
      _.forEach(providers, (p) => {
        result.push({
          ...data,
          ...p,
        });
      });
    });
    return result;
  }

  /**
   * Add new provider config
   *
   * @public
   * @static
   * @param {Object} params Parameters for adding a new provider config
   * @param {MoleculerContext} params.ctx Moleculer's Context
   * @param {string} params.providerName Name of the provider
   * @param {Object} params.config Configuration details for the provider
   * @return {Promise<any>} Promise resolving with the new provider config
   */
  static async saveProvider({ ctx, providerName, config }) {
    const provider = await getPluginProvider({ keyValueModel: ctx.tx.db.KeyValue, providerName });
    if (!provider)
      throw new LeemonsError(ctx, { message: `No provider with the name ${providerName}` });
    return ctx.tx.call(`${providerName}.email.saveConfig`, { config });
  }

  /**
   * Remove provider config
   *
   * @public
   * @static
   * @param {Object} params Parameters for removing provider config
   * @param {MoleculerContext} params.ctx Moleculer's Context
   * @param {string} params.providerName Name of the provider to remove config for
   * @param {string} params.id ID of the config to remove
   * @return {Promise<any>} Result of the removal operation
   * */
  static async removeProvider({ ctx, providerName, id }) {
    const provider = await getPluginProvider({ keyValueModel: ctx.tx.db.KeyValue, providerName });
    if (!provider)
      throw new LeemonsError(ctx, { message: `No provider with the name ${providerName}` });
    return ctx.tx.call(`${providerName}.email.removeConfig`, { id });
  }

  /**
   * Return the nodemailer transporters for all installed providers
   * @private
   * @static
   * @return {Promise<any>} nodemailer transporters
   * */
  static async getTransporters({ ctx }) {
    // TODO Roberto: Hay que repensar esta lógica en la que se solicita los plugins Providers de un determinado plugin
    //! TODO Jaime: Tenemos que ver como coger los transporters, ya que no creo que se puedan pasar las instancias de nodemailer
    // Lanzo el error aposta
    throw new Error('TODO: HAY QUE REPENSAR LA LÓGICA DE LOS PROVIDERS');
    //! Dejo comentado el código "antiguo"

    /*
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
                         */
  }

  /**
   * Adds an email template if it does not already exist.
   *
   * @public
   * @static
   * @param {EmailTemplateParams} params - The parameters for the email template, including template name, language, subject, HTML content, type, and additional context.
   * @return {Promise<boolean>} A promise that resolves to true if the email was added or already exists.
   */
  static async addIfNotExist({ templateName, language, subject, html, type, ctx }) {
    try {
      await Email.add({ templateName, language, subject, html, type, ctx });
      return true;
    } catch (err) {
      return true;
    }
  }

  /**
   * Adds an email template to the database if it does not already exist. If the template exists, it updates the existing template details with the new information provided.
   *
   * @public
   * @static
   * @param {EmailTemplateParams} params - The parameters for the email template, including template name, language, subject, HTML content, type, and additional context.
   * @returns {Promise<Object>} A promise that resolves with the added or updated email template details.
   */
  static async add({ templateName, language, subject, html, type, ctx }) {
    const db = ctx.tx?.db ?? ctx.db;
    let template = await db.EmailTemplate.findOne({ templateName }).select(['id']).lean();

    if (!template) {
      template = await db.EmailTemplate.create({
        name: templateName,
        templateName,
      });
      template = template.toObject();
    }

    const detail = await db.EmailTemplateDetail.countDocuments({
      template: template.id,
      language,
      type,
    });

    if (detail) {
      ctx.logger.debug(
        `Updating email template Name: ${templateName} Language: ${language} Type: ${type}`
      );

      return db.EmailTemplateDetail.findOneAndUpdate(
        { template: template.id, language, type },
        {
          template: template.id,
          language,
          subject,
          html,
          type,
        },
        { new: true, lean: true }
      );
    }

    ctx.logger.info(
      `Adding email template Name: ${templateName} Language: ${language} Type: ${type}`
    );

    const emailTemplateDetailDoc = await db.EmailTemplateDetail.create({
      template: template.id,
      language,
      subject,
      html,
      type,
    });

    return emailTemplateDetailDoc.toObject();
  }

  /**
   * Delete one template for one language
   *
   * @public
   * @static
   * @param {Object} params The parameters object
   * @param {string} params.templateName The name of the template to delete
   * @param {string} params.language The language of the template to delete
   * @param {string} params.type The type of the template to delete
   * @param {MoleculerContext} params.ctx Moleculer's Context
   * @return {Promise<any>} A promise that resolves when the template is deleted
   * */
  static async delete({ templateName, language, type, ctx }) {
    const template = await ctx.tx.db.EmailTemplate.findOne({ templateName }, ['id']).lean();
    if (!template)
      throw new LeemonsError(ctx, {
        message: `There is no template with the name ${templateName}`,
      });
    const templateDetail = await ctx.tx.db.EmailTemplateDetail.findOne(
      {
        template: template.id,
        language,
        type,
      },
      ['id']
    ).lean();
    if (!templateDetail)
      throw new LeemonsError(ctx, {
        message: `The ${templateName} email template does not have the language ${language} of type ${type}`,
      });
    return ctx.tx.db.EmailTemplateDetail.deleteOne({ id: templateDetail.id });
  }

  /**
   * Delete all data of one template including its details
   *
   * @public
   * @static
   * @param {Object} params The parameters object
   * @param {string} params.templateName The name of the template to delete
   * @param {MoleculerContext} params.ctx Moleculer's Context
   * @return {Promise<any>} A promise that resolves when the template and its details are deleted
   */
  static async deleteAll({ templateName, ctx }) {
    const template = await ctx.tx.db.EmailTemplate.findOne({ templateName }, ['id']).lean();
    if (!template)
      throw new LeemonsError(ctx, {
        message: `There is no template with the name ${templateName}`,
      });

    const value = await Promise.all([
      ctx.tx.db.EmailTemplate.deleteOne({ id: template.id }),
      ctx.tx.db.EmailTemplateDetail.deleteMany({ template: template.id }),
    ]);
    return value[0];
  }

  /**
   * Send email using a specified template and language. If the specified language template is not found, it tries with a fallback language.
   *
   * @public
   * @static
   * @param {Object} params The parameters object
   * @param {string} params.from The sender's email address
   * @param {string} params.to The recipient's email address
   * @param {string} params.templateName The name of the email template to use
   * @param {string} params.language The primary language to search the template in
   * @param {Object} params.context The data context to be used in the email template
   * @param {MoleculerContext} params.ctx Moleculer's Context
   * @param {string} [params.fallbackLanguage='en'] The fallback language to search the template in if the primary language template is not found
   * @return {Promise<boolean>} A promise that resolves to true if the email is sent successfully, otherwise throws an error
   */
  static async send({ from, to, templateName, language, fallbackLanguage = 'en', context, ctx }) {
    // Find email template
    let email = await Email.findEmail({ templateName, language, ctx });

    if (!email) {
      email = await Email.findEmail({ templateName, language: fallbackLanguage, ctx });
    }

    if (!email) {
      throw new LeemonsError(ctx, {
        message: `No email found for template '${templateName}' and language '${_.uniq([
          language,
          fallbackLanguage,
        ]).join(', ')}'`,
      });
    }

    // Take email settings and try to send email with each setting until it is sent.
    const providers = await Email.providersArray({ ctx });
    if (!providers.length) {
      throw new LeemonsError(ctx, { message: 'No email providers configured yet' });
    }

    const [logo, width] = await Promise.all([
      ctx.tx.call('users.platform.getEmailLogo'),
      ctx.tx.call('users.platform.getEmailWidthLogo'),
    ]);

    context.__from = from;
    context.__to = to;
    context.__platformName = 'Leemons';
    context.__logoWidth = width ? `${width}px` : '224px';
    context.__logoUrl =
      logo ||
      'https://s3.eu-west-1.amazonaws.com/global-assets.leemons.io/logo_leemons_407d9548b9.png';

    // Compile email with data
    email.subject = Sqrl.render(email.subject, context);
    email.html = Sqrl.render(email.html, context);

    // console.log('--- EmailService > send:');

    return Email.startToTrySendEmail({ from, to, email, providers, index: 0, ctx });
  }

  /**
   * Sends a custom test email to verify the functionality of the email transporter.
   * This method is intended for internal use.
   *
   * @private
   * @static
   * @param {Object} params The parameters object
   * @param {string} params.from The sender's email address
   * @param {string} params.to The recipient's email address
   * @param {string} params.subject The subject of the email
   * @param {string} params.body The HTML body of the email
   * @param {MoleculerContext} params.ctx Moleculer's Context
   * @return {Promise<boolean>} A promise that resolves to true if the email is sent successfully, otherwise throws an error
   */
  static async sendCustomTest({ from, to, subject, body, ctx }) {
    const providers = await Email.providersArray({ ctx });
    if (!providers.length)
      throw new LeemonsError(ctx, { message: 'No email providers configured yet' });

    const context = {
      __from: from,
      __to: to,
      __platformName: 'Leemons',
      __logoUrl:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAlESURBVHgB7Z1bbBzVGcf/Z3aNqkDTRQRXkASPyYtxqGKjtomqOGyKaHmohKvmpVWrxE+lRarDA31ppcQCJC4PxEhcXiCOQPACwpGQkEDgDU7AAQQbQexECHkcCLdEYhyQlWS9ezjf8Y6z3ptnd2bOOWvPT9rseDyOvd//O9937ofBUGw7ncI18z3icotVsDo5eAcYswGeAkMKXLxKYXDFPVdcOfTOwGYKVmEa8ziBi8ms42RcGAiDIUiDr8n3W8DtnCFNtxAqLMvAswWwDPKXjzinJhwYgFYBil6+m3HWL75MQy0ZDjaiWwwtAti3bk8Lo++DeqNXh2OUcxxypsZHoRhlApR4+16EHl5CwxGlYr9z8p1DUIQSAW6+dcegSKL7KxKnuSgTIlIBiqHmIMz1+OWIXIhIBLC70jZL5h8XHt+PFYAw0kghnxuKIlknEDKbNu/YjURhVBi/ByuHHmYl+lPttuuemzmBEAmtBFCSta4u7BOxfi9WMKKBd6DQZg052XAadqEIIENOIj+G1o31jeLwfG5nGCHJQkDs7t/1iHj/MVaP8QnhcG1j9NkRkEACULxnLPFxC1Uvw8Smzy5zXgCaTsLFuv0zWOVwoD+1rmPWPX9mAk3QlADS+JwfQIyEMdzVrAgNC0BFLvb8SkiE69pt5/sGq6kN1YJkwqWYH1MTzvO9zuS7Wb/P+07CsqrJEq8ipi7CRmN21zbb9/N+HqJGFrt61VU1g+DwtkSvn8aarxJALVzExm8E28pJmy3LsknY7u7bI8rJw4hplG1+knLdELQKuxjCxhVdFr31uizqhiBh/P2IjR+EFLPaHq/3QM0SQKFH1G0PIiYwPM9Fx93RTLXvJWv9kDC+ryTSDFt/sw4vHdwOk5j44Dz+NnAUUcASclSws9r3qoYgmXgjDD1Tp2Zx4YccTOKV0TOIENu+pa/qOElVAaL0foKMH/EHbpjjH55HlDAL++yedEWvcYUAUXu/xxtvfw1TIGf48uwcIiaFS7k95TcrBIja+z2Oi5hLcdcEhp8+BRUwyxosv7dEAPtXfTSLwYYi/vv/j7Tnguee/1yF93vYdtf2dOmNJQKwPAKN7jQKffDhJ9V4X9Xf/9UcnnhK7e8XNaIlEWaxHVBs9U5DAy+KKuk2UTVVCZW8P+0aU+n9i4iOumu9jrorJcDKp6GJe/5zXHqjSh54+BMtxpeUJONFAUTyVRp+SiFvpEaQKhHu/99HeOWwvmqwSMZ3L17TPzrDTylrf96Gxx66DXf+/gZEAQn9T1HajhtQ+/LCkOyOTrVv7BclQPs8zkuXC3jt9bPyOuycQFXegXvek61wI8jPn3bPfZGVIYgxQxZKFBkWNZMdf3wjlNYyhTXyehnidMX8KlhI3E7vMgR1bt4uhhuZkZNpN6xfg8F/dWHrb9dhw41rfP0MhZpJ4ekkpAnhpgbO9MnxTkb9EyyX/x4tQHfXL7D11+ukKLeI61LOCu8mo0+enjWys68alAeSmKeloMYslqyLNLApMTwMLs73WOB8Jc3jby0YJwGYjRg9MGYnGVgHWgiK/ZQLyhPyhQu5lor/CwgB5LJ/w6EhzF1334Q777hBNtaWg/IEVWFpzOHsV+ZUPcthjHWwzs191AK2YSADf9+EwXu7fBm9Fi8LIag6aqgQDglAVVCjSgF5/GMP3iarm2FBIgw/pa/ruwYuCcBhEIP/7pKvKKCW8F9Fi9ik0hB4jViYPCo64qIyPkEliqbDrL8xvJIVFGMEIONToo0a00QwQgDyehXG9zBJBBJA605SfxGGjzLs1IJEoLEHzbhaBSAP1GF8DxpzGPjHJmiEBODaBCDjh1nVbPZvCNLOCAIHd6gvyIEGyPt39auL+7Ug42srBZzNWkKFGWhAZ+gphwTQUwqoBDDuQAOq5wHVg4wf1USAunApAPO9pjUsqKtBd+wv5w936BCAiUH5ZFK5AKYZn1iv42/6WTJrFafIOVDIm2+ZMzXdY+J91YP3LEu2ly1hXsARKIQGTEyZmu4x8sLnUAnt4kvvVvGrDBRjUtcwOYPqOUNyC2V4AlyVUL5jrFELNHQ4Q/6yjDpSgGIeyEAxJpQCGrpUPXlLtL0y3uJt68rNwmEohj74wefVxt5SaNqiquVJS7FGFq8W77W1jUADVAq+1DRCRatztMwXLYYfYlEAXWFI9doADxJexxoBznG4dO+IJQMynPEhaIC8UOUqGc0D9Eu2f6iYFNrZ3Tct7trQALWQab3YhghHqrQan8OZnhxfsmVBxX5BqfaNjIHdBQ1QOHrz7a9l51h32eznoHjrBHQuTeKM7S3fe7qiBBSnq9NkLa1zheRQ5b1dgUsDiUo1LXppnbJYxfuJihLgfuNcFKXgkq5S4DF1elYajfLD2rVtDXfgkbGfefYzDN7/Id459p1c/qSTat5P1FwYoDMXVIMEoMUZ1G1Mo2n0tTeIQsam11Rx/QC1sI1aGVPD+4naGzYtnH4xhpjAcLA9tU7hqDkvyPn0aIZOF0JMIOj0jXpHoNSdmMULifuged5QSyNCDx19Uu+RuttWuucdN3V9x7cmrCFuRSjxOlPH6o61LLtvqHvuTDb1y5uuFbWibYjxDed82Jkcf2S55/zNDU0m6QwwBzH+IFvNJff7edSXANRRJ/LBTsT5YHmE8Xkht9Pv6a3x9vUhE9n29QT9x6I7dQAxVSHbNGJ8ouETNGRSbt84q7urwjTEiOJ9zuTRhk8WaeoMGffcFxOxCFeQxj95rKkzdZo+RUmKcH3HzGpvIyyEncY93yPwLh0yMSPxqkkdd4pwRcLd2WjMLye8owyt/NiqEcGrappwlCHhnMo4/KpErxhTHsYKh1q4fC7RG9bRtqFvFCTPHQD2rcDSIEIORE1nfAQhEvp5wrKaet3Nh2Fx0X+0Qs4UZhjl+dyfnal3MwiZaI80b/XSQLHe4gNybCQilOxV1oJCuKJuP9Rs3b4RlG4WZ7wQCx5/AD8mD/ntTAuKlt365Db5eb6bMWZEI45mKwtLDEUZamqhdbtEaj/ITcOZEAMsDYUUjT6q0turYcx+lVfEoF18+RYW/kayjqhGZsT7EcwlRnUavRRjBCiHDhDFNbSnKbagYHUChQ7a304IY2Nh1l75zD0yqEie3F0YvbNmYBVoht8J4eVZUwxezk+aovin0zrCfQAAAABJRU5ErkJggg==',
    };

    // Compile email with data
    const email = {
      subject,
      html: body,
    };

    return Email.startToTrySendEmail({ from, to, email, providers, index: 0, ctx });
  }

  /**
   * Sends an email using platform settings.
   * This method is public and static.
   *
   * @param {Object} params The parameters object.
   * @param {string} params.to The recipient's email address.
   * @param {string} params.templateName The name of the email template to use.
   * @param {string} params.language The language in which the email should be sent.
   * @param {Object} params.context The context object containing variables for the email template.
   * @param {MoleculerContext} params.ctx Moleculer's Context
   * @returns {Promise<boolean>} A promise that resolves to true if the email is sent successfully, otherwise false.
   */
  static async sendAsPlatform({ to, templateName, language, context, ctx }) {
    return Email.sendAsEducationalCenter({ to, templateName, language, context, ctx });
  }

  /**
   * Sends an email using the educational center's settings.
   * This method is public and static.
   *
   * @param {Object} params The parameters object.
   * @param {string} params.to The recipient's email address.
   * @param {string} params.templateName The name of the email template to use.
   * @param {string} params.language The language in which the email should be sent.
   * @param {string} params.centerId ID of the educational center.
   * @param {MoleculerContext} params.ctx Moleculer's Context
   * @param {Object} [params.context] The optional context object containing variables for the email template.
   * @returns {Promise<boolean>} A promise that resolves to true if the email is sent successfully, otherwise false.
   */
  static async sendAsEducationalCenter({
    to,
    templateName,
    language,
    centerId,
    ctx,
    context = {},
  }) {
    let email = null;
    let locale = null;

    if (centerId) {
      const center = await ctx.tx.call('users.centers.detail', { id: centerId });
      if (center) {
        context.__center = center;
        if (center.email) email = center.email;
        if (center.locale) locale = center.locale;
      }
    }

    if (!email || !locale) {
      const [pEmail, pLocale] = await Promise.all([
        ctx.tx.call('users.platform.getEmail'),
        ctx.tx.call('users.platform.getDefaultLocale'),
      ]);
      if (!email) email = pEmail;
      if (!locale) locale = pLocale;
    }

    return Email.send({ email, to, templateName, language, locale, context, ctx });
  }

  /**
   * Starts to try to send an email.
   * This method is private and static.
   *
   * @param {Object} params The parameters object.
   * @param {string} params.from The sender's email address.
   * @param {string} params.to The recipient's email address.
   * @param {Object} params.email The email object.
   * @param {Array} params.providers The email providers array.
   * @param {number} params.index The index of the provider to use.
   * @param {boolean} [params.errIfNotProvider] If true, throws an error if no provider is found.
   * @param {MoleculerContext} params.ctx Moleculer's Context
   * @returns {Promise<any>} A promise that resolves to the result of the email sending.
   */
  static async startToTrySendEmail({
    from,
    to,
    email,
    providers,
    index,
    errIfNotProvider = false,
    ctx,
  }) {
    try {
      const receipts = {
        from: from || 'no-reply@leemons.io',
        to,
      };

      const provider = providers[index];

      if (!provider) {
        if (errIfNotProvider) {
          return { error: true, message: 'Could not send email with any provider' };
        }
        // eslint-disable-next-line no-param-reassign
        errIfNotProvider = true;
        await nodemailer
          .createTransport({
            sendmail: true,
          })
          .sendMail({
            ...receipts,
            subject: email.subject,
            html: email.html,
          });
      }

      const info = await ctx.tx.call(`${provider.providerName}.email.sendMail`, {
        ...receipts,
        subject: email.subject,
        html: email.html,
        provider,
      });
      ctx.logger?.log('--> Resultado email:', info);
      info.error = false;
      return info;
    } catch (err) {
      ctx.logger?.error('ERROR > Error email:', err);
      return Email.startToTrySendEmail({
        from,
        to,
        email,
        providers,
        index: index + 1,
        errIfNotProvider,
        ctx,
      });
    }
  }

  /**
   * Retrieves an email template based on the provided template name and language.
   *
   * @private
   * @static
   * @param {Object} params The parameters object.
   * @param {string} params.templateName The name of the template to retrieve.
   * @param {string} params.language The language of the template to retrieve.
   * @param {MoleculerContext} params.ctx Moleculer's Context
   * @return {Promise<any>} A promise that resolves with the email template details.
   */
  static async findEmail({ templateName, language, ctx }) {
    const globalCTX = _.cloneDeep(ctx);
    globalCTX.meta.deploymentID = 'global';
    globalCTX.db = ctx.service.metadata.LeemonsMongoDBMixin.models({
      ctx: globalCTX,
      autoTransaction: false,
      autoLRN: true,
      autoDeploymentID: true,
    });

    // Simultaneously search for the email template in both the current and global deployments,
    // with a preference for the template from the current deployment if available.
    const templates = await Promise.all([
      ctx.tx.db.EmailTemplate.findOne({ templateName }, ['id']).lean(), // Search in current deployment
      globalCTX.db.EmailTemplate.findOne({ templateName }, ['id']).lean(), // Search in global deployment
    ]);

    // Select the template from the current deployment if found; otherwise, use the global deployment template.
    let findAtContextDB = ctx.tx.db;
    let [template] = templates;
    if (!template?.id) {
      findAtContextDB = globalCTX.db;
      [, template] = templates;
    }

    if (!template?.id) {
      throw new LeemonsError(ctx, {
        message: `There is no template with the name ${templateName}`,
      });
    }
    const emailDetail = await findAtContextDB.EmailTemplateDetail.findOne(
      {
        template: template.id,
        language,
        type: getEmailTypes().active,
      },
      ['id', 'subject', 'html']
    ).lean();
    console.log('emailDetail', emailDetail);
    return emailDetail;
  }
}

module.exports = Email;
