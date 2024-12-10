const { calculateUserAgentInstanceNote } = require('./calculateUserAgentInstanceNote');

async function setOpenQuestionGrade({ data, ctx }) {
  const { instanceId, studentUserAgentId, questionId, teacherReviewStatus, teacherFeedback } = data;

  const [assignation, instance] = await Promise.all([
    ctx.tx.call('assignables.assignations.getAssignation', {
      assignableInstanceId: instanceId,
      user: studentUserAgentId,
    }),
    ctx.tx.call('assignables.assignableInstances.getAssignableInstance', {
      id: instanceId,
      details: true,
    }),
  ]);

  const instanceClasses = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: instance.classes,
  });

  const currentResponse = await ctx.tx.db.UserAgentAssignableInstanceResponses.findOneAndUpdate(
    {
      instance: instanceId,
      question: questionId,
      userAgent: studentUserAgentId,
    },
    {
      status: teacherReviewStatus,
    },
    { upsert: true, new: true, lean: true }
  );

  const { note, questions: gradedQuestions } = await calculateUserAgentInstanceNote({
    instanceId,
    userAgent: studentUserAgentId,
    ctx,
  });

  let updatedProperties;
  if (teacherFeedback) {
    updatedProperties = {
      ...(currentResponse.properties ? JSON.parse(currentResponse.properties) : {}),
      teacherFeedback,
    };
  }

  const updatedQuestionResponse =
    await ctx.tx.db.UserAgentAssignableInstanceResponses.findOneAndUpdate(
      {
        instance: instanceId,
        question: questionId,
        userAgent: studentUserAgentId,
      },
      {
        ...gradedQuestions[questionId],
        ...(updatedProperties ? { properties: JSON.stringify(updatedProperties) } : {}),
      },
      { upsert: true, new: true, lean: true }
    );

  const grades = instanceClasses
    .map(({ subject }) => subject.id)
    .map((subjectId) => ({
      subject: subjectId,
      type: 'main',
      grade: note,
      gradedBy: 'auto-graded',
    }));

  await ctx.tx.call('assignables.assignations.updateAssignation', {
    assignation: {
      assignableInstance: instanceId,
      user: studentUserAgentId,
      grades,
      metadata: {
        ...assignation.metadata,
        score: {
          count: Object.values(gradedQuestions).filter(({ status }) => status === 'ok').length,
          total: Object.values(gradedQuestions).length,
        },
      },
    },
  });

  return updatedQuestionResponse;
}

module.exports = {
  setOpenQuestionGrade,
};
