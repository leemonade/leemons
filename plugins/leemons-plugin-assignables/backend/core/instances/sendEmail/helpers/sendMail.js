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

async function sendEmail({ to, language, centerId, templateName, context, ctx }) {
  try {
    await ctx.tx.call('emails.email.sendAsEducationalCenter', {
      to,
      templateName,
      language,
      context,
      centerId,
    });

    ctx.logger.debug(`Email enviado a ${to}`);
  } catch (error) {
    ctx.logger.error(error);

    throw error;
  }
}

module.exports = { sendEmail };
