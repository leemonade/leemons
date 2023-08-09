async function addSubstage({ name, abbreviation, number, program, frequency, index, ctx }) {
  ctx.tx.db.Groups.create({
    name,
    abbreviation,
    number,
    program,
    frequency,
    index,
    type: 'substage',
  });
}

module.exports = { addSubstage };
