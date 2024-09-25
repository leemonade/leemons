const { canSendEmail } = require('./canSendEmail');
const { prepareEmailContext } = require('./prepareEmailContext');

async function prepareEmailPerStudent({
  instance,
  userAgent,
  classes,
  hostname,
  hostnameAPI,

  ignoreUserConfig,
  isReminder,
  ctx,
}) {
  const canBeSent =
    ignoreUserConfig || (await canSendEmail({ instance, userAgent, ignoreUserConfig, ctx }));

  if (!canBeSent) {
    return null;
  }

  const context = await prepareEmailContext({
    instance,
    userAgent,
    classes,
    hostname,
    hostnameApi: hostnameAPI,
    ctx,
  });

  return {
    to: userAgent.user.email,
    templateName: isReminder ? 'user-assignation-remember' : 'user-create-assignation',
    language: userAgent.user.locale,
    context,
    centerId: userAgent.center.id,
  };
}

module.exports = { prepareEmailPerStudent };
