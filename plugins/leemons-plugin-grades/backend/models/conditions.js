const { mongoose, newModel } = require('leemons-mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    deploymentID: {
      type: String,
      required: true,
      index: true,
    },
    //
    // program | course | subject-type | knowledge | subject | subject-group
    source: {
      type: String,
    },
    // program ID | course ID | subject-type ID | knowledge ID | subject ID
    sourceIds: {
      type: String,
    },
    // gpa (Media) | cpp (Credits per program) | cpc (Credits per course) | grade | enrolled | credits | cbcg (Credits by course group)
    data: {
      type: String,
    },
    // For now only courseIds
    dataTargets: {
      type: String,
    },
    // gte | lte | gt | lt | eq | neq
    operator: {
      type: String,
    },
    target: {
      type: 'Number',
    },
    targetGradeScale: {
      // ref: 'plugins_grades::grade-scales',
      type: String,
    },
    rule: {
      // ref: 'plugins_grades::rules',
      type: String,
    },
    childGroup: {
      // ref: 'plugins_grades::condition-groups',
      type: String,
    },
    parentGroup: {
      // ref: 'plugins_grades::condition-groups',
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const conditionsModel = newModel(mongoose.connection, 'v1::grades_conditions', schema);

module.exports = { conditionsModel };
