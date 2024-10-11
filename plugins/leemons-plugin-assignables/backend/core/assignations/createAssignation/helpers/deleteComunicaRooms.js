const { uniqBy } = require('lodash');

const { deleteGroupRoom } = require('./comunica/deleteGroupRoom');
const { deleteInstanceRoom } = require('./comunica/deleteInstanceRoom');
const { deleteUserSubjectRoom } = require('./comunica/deleteUserSubjectRoom');

async function deleteCommunicaRooms({ instance, classes: classesData, ctx, assignations }) {
  const classes = uniqBy(classesData, 'subject.id');

  await Promise.all(
    classes.flatMap((classe) =>
      assignations.map((assignation) => deleteUserSubjectRoom({ assignation, classe, ctx }))
    )
  );

  await deleteGroupRoom({ assignableInstanceId: instance.id, ctx });

  await deleteInstanceRoom({ assignableInstanceId: instance.id, ctx });
}

module.exports = { deleteCommunicaRooms };
