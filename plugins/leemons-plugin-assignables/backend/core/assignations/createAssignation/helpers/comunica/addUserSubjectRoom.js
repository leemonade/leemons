const _ = require('lodash');

async function addUserSubjectRoom({
  assignableInstanceId,
  parentRoom,
  instance,
  classe,
  assignation,
  user,
  teachers,
  ctx,
}) {
  return ctx.tx.call('comunica.room.add', {
    key: ctx.prefixPN(
      `subject|${classe.subject.id}.assignation|${assignation.id}.userAgent|${user}`
    ),
    name: 'teachersOfSubject', // instance.assignable.asset.name,
    nameReplaces: {
      subjectName: classe.subject.name,
    },
    icon: instance.assignable.roleDetails.icon,
    bgColor: classe.color,
    parentRoom,
    image: instance.assignable.asset.cover ? instance.assignable.asset.id : undefined,
    program: classe.program,
    type: ctx.prefixPN('assignation.user'),
    userAgents: user,
    adminUserAgents: _.compact(_.uniq(teachers)),
    metadata: {
      iconIsUrl: true,
      assignableInstanceId,
      headerIconIsUrl: false,
      headerName: instance.assignable.asset.name,
      headerImage: instance.assignable.asset.id,
      headerIcon: instance.assignable.roleDetails.icon,
      headerBgColor: classe.color,
    },
  });
}

module.exports = { addUserSubjectRoom };
