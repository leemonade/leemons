// Temporary solution. The class should know about the knowledge area in order to optimize processes, just like subject types.
// Currently, all classes of a subject will use the same knowledge area

async function getKnowledgeAreasBySubjects({ subjectIds, ctx }) {
  const classes = await ctx.tx.db.Class.find({ subject: subjectIds })
    .select(['id', 'subject'])
    .lean();

  // Reduce classes to unique subject-class mappings a subject classes will share the same KA
  const uniqueSubjectClassMap = {};
  classes.forEach((cls) => {
    if (!uniqueSubjectClassMap[cls.subject]) {
      uniqueSubjectClassMap[cls.subject] = cls.id;
    }
  });

  const classIds = Object.values(uniqueSubjectClassMap);
  const knowledgeResults = await ctx.tx.db.ClassKnowledges.find({
    class: classIds,
  }).lean();

  const knowledgeAreas = {};
  knowledgeResults.forEach((kr) => {
    const classInfo = classes.find((c) => c.id === kr.class);
    if (classInfo && !knowledgeAreas[classInfo.subject]) {
      knowledgeAreas[classInfo.subject] = kr.knowledge;
    }
  });

  return knowledgeAreas;
}

module.exports = { getKnowledgeAreasBySubjects };
