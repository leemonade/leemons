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
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    image: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    abbreviation: {
      type: String,
      required: true,
    },
    // ES: Si credits es null es que no tiene sistema de creditos
    credits: {
      type: Number,
      default: null,
    },
    useOneStudentGroup: {
      type: Boolean,
    },
    maxGroupAbbreviation: {
      type: Number,
      required: true,
    },
    maxGroupAbbreviationIsOnlyNumbers: {
      type: Boolean,
      default: false,
    },
    // ES: Define el numero máximos de cursos que puede tener el programa
    maxNumberOfCourses: {
      type: Number,
      default: 0,
    },
    courseCredits: {
      type: Number,
      default: 0,
    },
    hideCoursesInTree: {
      type: Boolean,
      default: false,
    },
    moreThanOneAcademicYear: {
      type: Boolean,
      default: false,
    },
    haveSubstagesPerCourse: {
      type: Boolean,
    },
    // year | semester | trimester | quarter | month | week | day
    substagesFrequency: {
      type: String,
    },
    numberOfSubstages: {
      type: Number,
      default: 1,
    },
    useDefaultSubstagesName: {
      type: Boolean,
    },
    maxSubstageAbbreviation: {
      type: Number,
    },
    maxSubstageAbbreviationIsOnlyNumbers: {
      type: Boolean,
    },
    haveKnowledge: {
      type: Boolean,
    },
    maxKnowledgeAbbreviation: {
      type: Number,
    },
    maxKnowledgeAbbreviationIsOnlyNumbers: {
      type: Boolean,
    },
    subjectsFirstDigit: {
      type: String,
      required: true,
    },
    subjectsDigits: {
      type: Number,
      required: true,
    },
    treeType: {
      type: Number,
      default: 1,
    },
    totalHours: {
      type: Number,
    },
    hideStudentsToStudents: {
      type: Boolean,
    },
    evaluationSystem: {
      // TODO: Add reference to plugins grade
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const programsModel = newModel(mongoose.connection, 'v1::academic-portfolio_Programs', schema);

module.exports = { programsModel };
