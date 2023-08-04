async function add({ class: _class, course, ctx }) {
  return ctx.tx.db.ClassCourse.create({ class: _class, course });
}

module.exports = { add };
