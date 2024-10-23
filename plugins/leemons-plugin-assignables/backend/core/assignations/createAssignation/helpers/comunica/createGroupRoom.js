const _ = require('lodash');

async function createGroupRoom({
  assignableInstanceId,
  instance,
  parentKey,
  classes,
  teachers,
  users,
  ctx,
}) {
  const roomKey = ctx.prefixPN(`instance:${assignableInstanceId}:group`);
  const roomAlreadyExists = await ctx.tx.call('comunica.room.exists', { key: roomKey });

  const userAgents = _.compact(_.uniq(users));
  const teachersUserAgents = _.compact(_.uniq(teachers));

  // Creamos la sala que estara a primera altura
  if (!roomAlreadyExists) {
    return ctx.tx.call('comunica.room.add', {
      key: roomKey,
      name: 'activityGroup',
      subName: _.map(classes, 'subject.name').join(','),
      parentRoom: parentKey,
      program: classes[0].program,
      icon: instance.assignable.roleDetails.icon,
      bgColor: classes.length > 1 ? '#67728E' : classes[0].color,
      type: ctx.prefixPN('assignation.group'),
      metadata: {
        assignableInstanceId,
        iconIsUrl: true,
        headerIconIsUrl: classes.length > 1,
        headerName: instance.assignable.asset.name,
        headerSubName: classes.length > 1 ? 'multisubjects' : classes[0].subject.name,
        headerImage: instance.assignable.asset.cover ? instance.assignable.asset.id : undefined,
        headerIcon: instance.assignable.roleDetails.icon,
        headerBgColor: classes.length > 1 ? '#67728E' : classes[0].color,
      },
      userAgents,
      adminUserAgents: teachersUserAgents,
    });
  }
  // Si la sala ya existia significa que estamos añadiendo alumnos extra, añadimos estos a la sala y devolvemos la sala
  if (userAgents?.length)
    await ctx.tx.call('comunica.room.addUserAgents', {
      key: roomKey,
      userAgents,
    });
  if (teachersUserAgents?.length) {
    await ctx.tx.call('comunica.room.addUserAgents', {
      key: roomKey,
      userAgents: teachersUserAgents,
      isAdmin: true,
    });
  }
  return ctx.tx.call('comunica.room.get', {
    key: roomKey,
    userAgent: ctx.meta.userSession?.userAgents?.[0]?.id,
  });
}

module.exports = { createGroupRoom };
