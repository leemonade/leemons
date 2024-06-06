const { getCoverAndAvatarUrls } = require('./getCoverAndAvatarUrls');
const { formatDate } = require('./formatDate');

async function prepareEmailContext({ instance, userAgent, classes, hostname, hostnameApi, ctx }) {
  const { avatarUrl, coverUrl } = await getCoverAndAvatarUrls({
    instance,
    userSession: ctx.meta.userSession,
    hostname,
    hostnameApi,
    ctx,
  });

  let classColor = '#67728E';
  if (classes.length === 1) {
    classColor = classes[0].color;
  }

  return {
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
    taskDate: formatDate({ instance, userAgent }),
    userSession: {
      ...ctx.meta.userSession,
      avatarUrl,
    },
  };
}

module.exports = { prepareEmailContext };
