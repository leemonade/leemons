async function sendEmail({
  instance,
  userAgent,
  classes,
  userSession,
  ctx,
  hostname,
  hostnameApi,
  ignoreUserConfig,
  isReminder,
}) {
  try {
    const emailServices = leemons.getPlugin('emails').services;

    // eslint-disable-next-line prefer-const
    let [canSend, dayLimits] = await Promise.all([
      emailServices.config.getConfig(userAgent.user.id, { keys: 'new-assignation-email' }),
      emailServices.config.getConfig(userAgent.user.id, { keys: 'new-assignation-per-day-email' }),
    ]);

    if (dayLimits && instance.dates.deadline) {
      const hours = global.utils.diffHours(new Date(), new Date(instance.dates.deadline));
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
          ? `${hostname || ctx.request.header.origin}/public/assets/svgs/module-three.svg`
          : classes[0].subject.icon.cover
            ? (hostname || ctx.request.header.origin) +
            leemons.getPlugin('leebrary').services.assets.getCoverUrl(classes[0].subject.icon.id)
            : null;

       */

      let classColor = '#67728E';
      if (classes.length === 1) {
        classColor = classes[0].color;
      }

      emailServices.email
        .sendAsEducationalCenter(
          userAgent.user.email,
          isReminder ? 'user-assignation-remember' : 'user-create-assignation',
          userAgent.user.locale,
          {
            instance: {
              ...instance,
              assignable: {
                ...instance.assignable,
                asset: {
                  ...instance.assignable.asset,
                  color: instance.assignable.asset.color || '#D9DCE0',
                  url:
                    (hostnameApi || hostname || ctx.request.header.origin) +
                    leemons
                      .getPlugin('leebrary')
                      .services.assets.getCoverUrl(instance.assignable.asset.id),
                },
              },
            },
            classes,
            classColor,
            btnUrl: `${hostname || ctx.request.header.origin}/private/assignables/ongoing`,
            subjectIconUrl: null,
            taskDate: date,
            userSession: {
              ...userSession,
              avatarUrl: userSession.avatar
                ? (hostnameApi || hostname || ctx.request.header.origin) + userSession.avatar
                : null,
            },
          },
          userAgent.center.id
        )
        .then(() => {
          console.log(`Email enviado a ${userAgent.user.email}`);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  } catch (e) {
    console.error(e);
    // Error
  }
}

module.exports = { sendEmail };
