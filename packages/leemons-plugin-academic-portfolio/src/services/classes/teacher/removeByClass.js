const _ = require('lodash');
const { table } = require('../../tables');

async function removeByClass(classIds, { soft, transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const classTeachers = await table.classTeacher.find(
        { class_$in: _.isArray(classIds) ? classIds : [classIds] },
        { transacting }
      );
      await leemons.events.emit('before-remove-classes-teachers', {
        classTeachers,
        soft,
        transacting,
      });
      await table.classTeacher.deleteMany(
        { id_$in: _.map(classTeachers, 'id') },
        { soft, transacting }
      );
      // TODO: Quitar permiso de que pueda ver al resto de alumnos y profesores

      // TODO: remove classTeacher permission from class
      /* Eliminar permiso de la clase
       * removeCustomUserAgentPermission */
      await leemons.events.emit('after-remove-classes-teachers', {
        classTeachers,
        soft,
        transacting,
      });
      return true;
    },
    table.classTeacher,
    _transacting
  );
}

module.exports = { removeByClass };
