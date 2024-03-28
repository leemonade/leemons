const _ = require('lodash');

/**
 * Sends the profile activation guides emails to the user.
 *
 * @param {Object} params - The parameters.
 * @param {Object} params.user - The user object.
 * @param {UserProfile} params.profile - The profile object.
 * @param {MoleculerContext} params.ctx - The Moleculer's context.
 */
async function sendActivationEmailsByProfileToUser({ user, profile, ctx }) {
  try {
    const [config, deployment] = await Promise.all([
      ctx.tx.call('deployment-manager.getConfigRest', { allConfig: true }),
      ctx.tx.call('deployment-manager.getDeployment'),
    ]);

    const prefix = ctx.prefixPNV();
    const activationEmails = config[prefix]?.emails?.activation ?? [];
    const emailsByprofile = activationEmails.filter((email) => email.profile === profile.sysName);
    const platformUrl = `https://${_.last(deployment?.domains)}`;

    if (emailsByprofile.length) {
      emailsByprofile.forEach((email) => {
        ctx.cronJob.schedule(process.env.RECATCH_EMAILS_DELAY ?? email.when, email.job, {
          to: user.email,
          language: user.locale ?? 'en',
          platformUrl,
        });
      });
    }
  } catch (error) {
    ctx.logger?.error(error);
  }
}

module.exports = { sendActivationEmailsByProfileToUser };
