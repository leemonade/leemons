async function addSubstage({ name, abbreviation, number, program, frequency, index, ctx }) {
  const substageGroupDoc = await ctx.tx.db.Groups.create({
    name,
    abbreviation,
    number,
    program,
    frequency,
    index,
    type: 'substage',
  });
  return substageGroupDoc.toObject();
}

module.exports = { addSubstage };
