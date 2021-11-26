module.exports = {
  modelName: 'conditions',
  collectionName: 'conditions',
  options: {
    useTimestamps: true,
  },
  attributes: {
    // program | course | subject-type | knowledge | subject
    source: {
      type: 'string',
    },
    // program ID | course ID | subject-type ID | knowledge ID | subject ID
    sourceId: {
      type: 'string',
    },
    // gpa (Media) | cpp (Credits per program) | cpc (Credits per course) | grade
    data: {
      type: 'string',
    },
    // gte | lte | gt | lt | eq | neq
    operator: {
      type: 'string',
    },
    target: {
      type: 'float',
      scale: 4,
    },
    targetGradeScale: {
      references: {
        collection: 'plugins_grades::grade-scales',
      },
    },
    rule: {
      references: {
        collection: 'plugins_grades::rules',
      },
    },
    childGroup: {
      references: {
        collection: 'plugins_grades::condition-groups',
      },
    },
    parentGroup: {
      references: {
        collection: 'plugins_grades::condition-groups',
      },
    },
  },
  primaryKey: {
    type: 'uuid',
  },
};
