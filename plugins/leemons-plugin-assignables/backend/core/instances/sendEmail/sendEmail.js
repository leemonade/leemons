const { diffHours } = require('@leemons/utils');
const { isString } = require('lodash');

async function getCoverAndAvatarUrls({ ctx, instance, userSession, hostname, hostnameApi }) {
  const { deploymentID } = ctx.meta;

  let avatarUrl = userSession?.avatar;
  let coverUrl = await ctx.tx.call('leebrary.assets.getCoverUrl', {
    assetId: instance.assignable.asset.id,
  });

  if (isString(avatarUrl)) {
    if (!avatarUrl.startsWith('http')) {
      avatarUrl = `${hostnameApi || hostname}${avatarUrl}`;
    }
    const avatarUrlObj = new URL(avatarUrl);
    avatarUrlObj.searchParams.append('deploymentID', deploymentID);
    avatarUrl = avatarUrlObj.toString();
  }

  if (isString(coverUrl)) {
    if (!coverUrl.startsWith('http')) {
      coverUrl = `${hostnameApi || hostname}${coverUrl}`;
    }
    const coverUrlObj = new URL(coverUrl);
    coverUrlObj.searchParams.append('deploymentID', deploymentID);
    coverUrl = coverUrlObj.toString();
  }

  return { avatarUrl, coverUrl };
}

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
  hostname,
  hostnameApi,
  ignoreUserConfig,
  isReminder,
  ctx,
}) {
  try {
    const { userSession } = ctx.meta;

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

    if (dayLimits && instance.dates.deadline) {
      const hours = diffHours(new Date(), new Date(instance.dates.deadline));
      canSend = hours < dayLimits * 24;
    }

    if (ignoreUserConfig || canSend) {
      let date = null;
      const options1 = { year: 'numeric', month: 'numeric', day: 'numeric' };
      if (instance.dates.deadline) {
        const date1 = new Date(instance.dates.deadline);
        const dateTimeFormat2 = new Intl.DateTimeFormat(userAgent.user.locale, options1);
        date = dateTimeFormat2.format(date1);
      }

      /*
      let subjectIconUrl =
        // eslint-disable-next-line no-nested-ternary
        classes.length > 1
          ? `${hostname || ctx.request.header.origin}/public/assignables/module-three.svg`
          : classes[0].subject.icon.cover
            ? (hostname || ctx.request.header.origin) +
            leemons.getPlugin('leebrary').services.assets.getCoverUrl(classes[0].subject.icon.id)
            : null;
       */

      let classColor = '#67728E';
      if (classes.length === 1) {
        classColor = classes[0].color;
      }

      const { avatarUrl, coverUrl } = await getCoverAndAvatarUrls({
        ctx,
        instance,
        userSession,
        hostname,
        hostnameApi,
      });

      const context = {
        instance: {
          ...instance,
          assignable: {
            ...instance.assignable,
            asset: {
              ...instance.assignable.asset,
              color: instance.assignable.asset.color || '#D9DCE0',
              url: coverUrl,
            },
          },
        },
        classes,
        classColor,
        btnUrl: `${hostname}/private/assignables/ongoing`,
        subjectIconUrl: null,
        taskDate: date,
        userSession: {
          ...userSession,
          avatarUrl,
        },
      };

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
    // Error
  }
}

module.exports = { sendEmail };
