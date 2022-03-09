const { table } = require('../../tables');

async function add(_class, student, { transacting } = {}) {
  const classStudent = await table.classStudent.create({ class: _class, student }, { transacting });
  // TODO: Añadir el permiso del alumno a la clase
  /*
  permissions.addCustomPermissionToUserAgent(jaimeid, {
    permissionName: 'plugins.academic-portfolio.clasroom.clase1',
    actionNames: ['view'],
  })

   */
  await leemons.events.emit('after-add-class-student', { class: _class, student, transacting });
  return classStudent;
}

module.exports = { add };
