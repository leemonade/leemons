const { uniqBy } = require('lodash');
const { uniq } = require('lodash');
const { getTeachersBySubject } = require('./getTeachersBySubject');
const { createInstanceRoom } = require('./comunica/createInstanceRoom');
const { createGroupRoom } = require('./comunica/createGroupRoom');
const { addUserSubjectRoom } = require('./comunica/addUserSubjectRoom');

async function createComunicaRooms({
  instance,
  classes: classesData,
  users,
  ctx,
  createdAssignations,
}) {
  const teachers = getTeachersBySubject({ classesData });
  const allTeachers = uniq(Object.values(teachers).flat());

  const classes = uniqBy(classesData, 'subject.id');

  const parentRoom = await createInstanceRoom({
    assignableInstanceId: instance.id,
    instance,
    classes,
    teachers: allTeachers,
    users,
    ctx,
  });

  await createGroupRoom({
    assignableInstanceId: instance.id,
    instance,
    classes,
    parentKey: parentRoom.key,
    teachers: allTeachers,
    users,
    ctx,
  });

  await Promise.all(
    classes.flatMap((klass) =>
      createdAssignations.map((assignation) =>
        addUserSubjectRoom({
          assignableInstanceId: instance.id,
          parentRoom: parentRoom.key,
          classe: klass,
          instance,
          assignation: assignation.toObject(),
          user: assignation.user,
          teachers: teachers[klass.subject.id],
          ctx,
        })
      )
    )
  );
}

module.exports = { createComunicaRooms };
