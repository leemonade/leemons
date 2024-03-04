const { mongoDBPaginate } = require('@leemons/mongodb-helpers');

async function listSubjectType({ page, size, center, ctx }) {
  const subjectTypesData = await mongoDBPaginate({
    model: ctx.tx.db.SubjectTypes,
    page,
    size,
    query: { center },
  });

  const subjectTypesIds = subjectTypesData.items.map((item) => item.id);

  const notRemovableSubjectTypes = await ctx.tx.db.ClassSubjectType.find({
    subjectType: subjectTypesIds,
  }).lean();

  const notRemovablesIds = notRemovableSubjectTypes.map((item) => item.subjectType);

  subjectTypesData.items = subjectTypesData.items.map((item) => ({
    ...item,
    removable: !notRemovablesIds.includes(item.id),
  }));
  return subjectTypesData;
}

module.exports = { listSubjectType };
