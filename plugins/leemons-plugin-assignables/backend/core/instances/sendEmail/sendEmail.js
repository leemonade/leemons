const { canSendEmail } = require('./helpers/canSendEmail');
const { prepareEmailContext } = require('./helpers/prepareEmailContext');

/**
 * Sends an email with the instance details.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.instance - The instance to send.
 * @param {Object} params.userAgent - The user agent.
 * @param {Array} params.classes - The classes.
 * @param {string} params.hostname - The hostname.
 * @param {string} params.hostnameApi - The API hostname.
 * @param {boolean} params.ignoreUserConfig - Ignore user configuration.
 * @param {boolean} params.isReminder - If it is a reminder.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @return {Promise<void>} A promise that resolves when the email has been sent.
 */

async function sendEmail({
  instance,
  userAgent,
  classes,
  hostname: _hostname,
  hostnameApi: _hostnameApi,
  ignoreUserConfig,
  isReminder,
  ctx,
}) {
  const hostname = _hostname || (await ctx.tx.call('users.platform.getHostname'));
  const hostnameApi = _hostnameApi || (await ctx.tx.call('users.platform.getHostnameApi'));

  try {
    // eslint-disable-next-line prefer-const
    let [canSend, dayLimits] = await Promise.all([
      ctx.tx.call('emails.config.getConfig', {
        userAgent: userAgent.user.id,
        keys: 'new-assignation-email',
      }),
      ctx.tx.call('emails.config.getConfig', {
        userAgent: userAgent.user.id,
        keys: 'new-assignation-per-day-email',
      }),
    ]);

    canSend = ignoreUserConfig || (await canSendEmail({ instance, dayLimits }));

    if (canSend) {
      const context = await prepareEmailContext({
        instance,
        userAgent,
        classes,
        hostname,
        hostnameApi,
        ctx,
      });

      context.debugObject = JSON.stringify({
        userSession: context.userSession,
        instance: context.instance,
      });

      try {
        await ctx.tx.call('emails.email.sendAsEducationalCenter', {
          to: userAgent.user.email,
          templateName: isReminder ? 'user-assignation-remember' : 'user-create-assignation',
          language: userAgent.user.locale,
          context,
          centerId: userAgent.center.id,
        });

        ctx.logger.debug(`Email enviado a ${userAgent.user.email}`);
      } catch (error) {
        ctx.logger.error(error);
      }
    }
  } catch (e) {
    ctx.logger.error(e);
  }
}

module.exports = { sendEmail };
