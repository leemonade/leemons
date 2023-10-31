const _ = require('lodash');

async function createSubjectsRooms({
  assignableInstanceId,
  instance,
  parentKey,
  classes,
  teachers,
  ctx,
}) {
  async function createSubjectRoom(classe) {
    const roomKey = ctx.prefixPN(`instance:${assignableInstanceId}:subject:${classe.subject.id}`);
    const roomAlreadyExists = await ctx.tx.call('comunica.room.exists', { key: roomKey });

    // Creamos la sala que estara a primera altura
    if (!roomAlreadyExists) {
      return ctx.tx.call('comunica.room.add', {
        key: roomKey,
        name: classe.subject.name,
        parentRoom: parentKey,
        image: classe.subject.image?.id,
        icon: classe.subject.icon?.id,
        bgColor: classe.color,
        program: classes[0].program,
        type: ctx.prefixPN('assignation.subject'),
        adminUserAgents: _.compact(_.uniq(teachers)),
        metadata: {
          headerIconIsUrl: false,
          headerName: instance.assignable.asset.name,
          headerSubName: classe.subject.name,
          headerImage: instance.assignable.asset.id,
          headerIcon: classe.subject.icon?.id,
          headerBgColor: classe.color,
        },
      });
    }
    // Si la sala ya existia significa que estamos añadiendo alumnos extra, añadimos estos a la sala y devolvemos la sala
    if (teachers.length)
      await ctx.tx.call('comunica.room.addUserAgents', {
        key: roomKey,
        userAgent: _.compact(_.uniq(teachers)),
        isAdmin: true,
      });
    return ctx.tx.call('comunica.room.get', { key: roomKey });
  }

  const result = {};

  const r = await Promise.all(_.map(classes, createSubjectRoom));
  _.forEach(classes, (classe, index) => {
    result[classe.subject.id] = r[index];
  });

  return result;
}

module.exports = { createSubjectsRooms };
