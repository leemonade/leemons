const { map } = require('lodash');
const { table } = require('../tables');
const { validateAddKnowledge } = require('../../validations/forms');
const { updateClassMany } = require('../classes/updateClassMany');

async function addKnowledge(_data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddKnowledge(_data, { transacting });
      const { subjects, ...data } = _data;
      const knowledge = await table.knowledges.create(data, { transacting });
      if (subjects && subjects.length) {
        const classes = await table.class.find(
          {
            subject_$in: subjects,
            program: data.program,
          },
          { transacting }
        );
        await updateClassMany(
          {
            ids: map(classes, 'id'),
            knowledge: knowledge.id,
          },
          { transacting }
        );
      }
      return knowledge;
    },
    table.knowledges,
    _transacting
  );
}

module.exports = { addKnowledge };
