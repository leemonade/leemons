const _ = require('lodash');

async function addUserSubjectRoom({
  parentKey,
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
    icon: classe.subject.icon?.id,
    bgColor: classe.color,
    parentRoom: parentKey,
    program: classe.program,
    type: ctx.prefixPN('assignation.user'),
    userAgents: user,
    adminUserAgents: _.compact(_.uniq(teachers)),
    metadata: {
      headerIconIsUrl: false,
      headerName: instance.assignable.asset.name,
      headerImage: instance.assignable.asset.id,
      headerIcon: classe.subject.icon?.id,
      headerBgColor: classe.color,
    },
  });
}

module.exports = { addUserSubjectRoom };
