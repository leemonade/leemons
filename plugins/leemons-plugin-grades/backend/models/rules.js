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
    name: {
      type: String,
      options: {
        notNull: true,
      },
    },
    center: {
      // ref: 'plugins_users::centers',
      type: String,
    },
    grade: {
      // ref: : 'plugins_grades::grades',
      type: String,
    },
    program: {
      // ref: 'plugins_academic-portfolio::programs',
      type: String,
    },
    // ES: Grupo desde el que empezar a evaluar las condiciones
    // EN: Group from which start to evaluate the conditions
    group: {
      // ref: 'plugins_grades::condition-groups',
      type: String,
    },
    isDependency: {
      type: Boolean,
      default: false,
      required: true,
    },
    subject: {
      // ref: : 'plugins_academic-portfolio::subjects',
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const rulesModel = newModel(mongoose.connection, 'v1::grades_rulesModel', schema);

module.exports = { rulesModel };
