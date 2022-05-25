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

  await leemons.getPlugin('users').services.permissions.addCustomPermissionToUserAgent(
    teacher,
    {
      permissionName: `plugins.academic-portfolio.class.${_class}`,
      actionNames: ['view', 'edit'],
    },
    { transacting }
  );

  await leemons.events.emit('after-add-class-teacher', { class: _class, teacher, transacting });

  return classTeacher;
}

module.exports = { add };
