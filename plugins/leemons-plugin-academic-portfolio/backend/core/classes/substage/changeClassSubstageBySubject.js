async function changeClassSubstageBySubject({ subjectId, substage, ctx }) {
  const classes = await ctx.tx.db.Class.find({ subject: subjectId }).select(['id']).lean();

  const updatePromises = [];
  classes.forEach((c) => {
    ctx.tx.db.ClassSubstage.findOneAndUpdate(
      { class: c.id },
      { substage },
      { new: true, upsert: true, lean: true }
    );
  });
  Promise.all(updatePromises);
  return true;
}

module.exports = { changeClassSubstageBySubject };
