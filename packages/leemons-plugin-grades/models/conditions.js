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
      options: {
        notNull: true,
      },
    },
    // program ID | course ID | subject-type ID | knowledge ID | subject ID
    sourceId: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    // gpa (Media) | cpp (Credits per program) | cpc (Credits per course) | grade
    data: {
      type: 'string',
      options: {
        notNull: true,
      },
    },
    // gte | lte | gt | lt | eq
    operator: {
      type: 'string',
      options: {
        notNull: true,
      },
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
