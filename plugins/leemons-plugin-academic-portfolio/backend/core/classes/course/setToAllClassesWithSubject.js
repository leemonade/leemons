const _ = require('lodash');
const { isArray } = require('lodash');
const { removeByClass } = require('./removeByClass');
const { add } = require('./add');

async function setToAllClassesWithSubject({ subject, course, ctx }) {
  const courses = isArray(course) ? course : [course];

  const classes = await ctx.tx.db.Class.find({ subject }).lean(['id']);
  // ES: Borramos la relación de los cursos de todas las clases con dicha asignatura
  await Promise.all(_.map(classes, ({ id }) => removeByClass({ classIds: id, ctx })));
  // ES: Una vez borrados añadimos las nuevas relaciones
  await Promise.all(
    _.map(classes, ({ id }) =>
      Promise.all(_.map(courses, (c) => add({ class: id, course: c, ctx })))
    )
  );
}

module.exports = { setToAllClassesWithSubject };
