module.exports = {
  modelName: 'taskAssessmentCriteria',
  attributes: {
    task: {
      type: 'string',
    },
    assessmentCriteria: {
      type: 'string',
    },
    subject: {
      type: 'uuid',
    },
    position: {
      type: 'integer',
    },
  },
};
