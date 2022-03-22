const { table } = require('../../tables');

async function add(_class, teacher, type, { transacting } = {}) {
  const classTeacher = await table.classTeacher.create(
    {
      class: _class,
      teacher,
      type,
    },
    { transacting }
  );
  // TODO: Añadir al profesor que pueda ver a los alumnos y al resto de profesores y añadir al alumno que pueda ver al profesor y al resto de alumnos

  // TODO: Añadir el permiso del profesor a la clase
  /*
  permissions.addCustomPermissionToUserAgent(jaimeid, {
    permissionName: 'plugins.academic-portfolio.clasroom.clase1',
    actionNames: ['view'],
  })

   */
  await leemons.events.emit('after-add-class-teacher', { class: _class, teacher, transacting });
  return classTeacher;
}

module.exports = { add };
