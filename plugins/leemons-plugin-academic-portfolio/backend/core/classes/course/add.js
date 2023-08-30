async function add({ class: _class, course, ctx }) {
  const classCourseDoc = await ctx.tx.db.ClassCourse.create({ class: _class, course });
  return classCourseDoc.toObject();
}

module.exports = { add };
