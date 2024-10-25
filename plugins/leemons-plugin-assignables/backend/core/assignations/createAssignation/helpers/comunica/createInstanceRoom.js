const _ = require('lodash');

async function createInstanceRoom({
  assignableInstanceId,
  instance,
  classes,
  teachers,
  users,
  ctx,
}) {
  const roomKey = ctx.prefixPN(`instance:${assignableInstanceId}`);
  const roomAlreadyExists = await ctx.tx.call('comunica.room.exists', { key: roomKey });

  const userAgents = _.compact(_.uniq(users));
  const teachersUserAgents = _.compact(_.uniq(teachers));

  // Creamos la sala que estara a primera altura
  if (!roomAlreadyExists) {
    return ctx.tx.call('comunica.room.add', {
      key: roomKey,
      name: instance.assignable.asset.name,
      subName: classes.length > 1 ? 'multisubjects' : classes[0].subject.name,
      parentRoom: _.map(classes, (nClass) => `academic-portfolio.room.class.group.${nClass.id}`),
      image: instance.assignable.asset.cover ? instance.assignable.asset.id : undefined,
      program: classes[0].program,
      icon: instance.assignable.roleDetails.icon,
      bgColor: classes.length > 1 ? '#67728E' : classes[0].color,
      type: ctx.prefixPN('assignation'),
      userAgents,
      adminUserAgents: teachersUserAgents,
      metadata: {
        assignableInstanceId,
        iconIsUrl: true,
      },
    });
  }
  // Si la sala ya existia significa que estamos añadiendo alumnos extra, añadimos estos a la sala y devolvemos la sala
  if (userAgents.length)
    await ctx.tx.call('comunica.room.addUserAgents', {
      key: roomKey,
      userAgents,
    });
  if (teachersUserAgents.length) {
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

module.exports = { createInstanceRoom };
