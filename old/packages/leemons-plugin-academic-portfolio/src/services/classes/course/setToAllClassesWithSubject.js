const _ = require('lodash');
const { isArray, map } = require('lodash');
const { table } = require('../../tables');
const { removeByClass } = require('./removeByClass');
const { add } = require('./add');

async function setToAllClassesWithSubject(subject, course, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const courses = isArray(course) ? course : [course];

      const classes = await table.class.find({ subject }, { columns: ['id'], transacting });
      // ES: Borramos los cursos de todas las clases con dicha asignatura
      await Promise.all(_.map(classes, ({ id }) => removeByClass(id, { transacting })));
      // ES: Una vez borrados todos los cursos les añadimos los nuevos
      await Promise.all(
        _.map(classes, ({ id }) => Promise.all(_.map(courses, (c) => add(id, c, { transacting }))))
      );
    },
    table.class,
    _transacting
  );
}

module.exports = { setToAllClassesWithSubject };
