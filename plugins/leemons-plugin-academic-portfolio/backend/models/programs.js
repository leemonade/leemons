const { mongoose, newModel } = require('@leemons/mongodb');

const schema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    deploymentID: {
      type: String,
      required: true,
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
    // OUTDATED, to be replaced with groups metadata
    maxGroupAbbreviation: {
      type: Number,
    },
    // OUTDATED, to be replaced with groups metadata
    maxGroupAbbreviationIsOnlyNumbers: {
      type: Boolean,
      default: false,
    },
    // ES: Define el numero máximos de cursos que puede tener el programa
    maxNumberOfCourses: {
      type: Number,
      default: 0,
    },
    // OUTDATED, each course can have its own max and min credits now
    courseCredits: {
      type: Number,
      default: 0,
    },
    hideCoursesInTree: {
      type: Boolean,
      default: false,
    },
    // Flag to indicate that i subject can be given in more than one course. Possibly replaced by sequentialCourses field
    moreThanOneAcademicYear: {
      type: Boolean,
      default: false,
    },
    hasSubstagesPerCourse: {
      type: Boolean,
    },
    // OUTDATED, posibbly. Currently we don't ask about substages frecuency to the user at all.
    // year | semester | trimester | quarter | month | week | day
    substagesFrequency: {
      type: String,
    },
    numberOfSubstages: {
      type: Number,
      default: 0,
    },
    useDefaultSubstagesName: {
      type: Boolean,
    },
    // OUTDATED, substages are abbreviation is not limited
    maxSubstageAbbreviation: {
      type: Number,
    },
    // OUTDATED, substages are abbreviation is not limited
    maxSubstageAbbreviationIsOnlyNumbers: {
      type: Boolean,
    },
    haveKnowledge: {
      type: Boolean,
    },
    // OUTDATED, knowledges are defined at center level now and its abbreviation is not restricted
    maxKnowledgeAbbreviation: {
      type: Number,
    },
    // OUTDATED, knowledges are defined at center level now and its abbreviation is not restricted
    maxKnowledgeAbbreviationIsOnlyNumbers: {
      type: Boolean,
    },
    // OUTDATED, this info is not being asked to the user anymore
    subjectsFirstDigit: {
      type: String,
    },
    // OUTDATED, this info is not being asked to the user anymore
    subjectsDigits: {
      type: Number,
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
      type: String,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    hasSubjectTypes: {
      type: Boolean,
      defaults: false,
    },
    useCustomSubjectIds: {
      type: Boolean,
      defaults: false,
    },
    useAutoAssignment: {
      type: Boolean,
      defaults: false,
    },
    sequentialCourses: {
      type: Boolean,
      default: true,
    },
    hoursPerCredit: {
      type: Number,
    },
    // { nameFormat, digits, customNameFormat, prefix, groupsPerCourseN }
    // For each course, the groups amount is added, N is the course index.
    // Programs with not sequential courses have the same amount of groups for all courses
    groupsMetadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    seatsForAllCourses: {
      type: Number,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

schema.index({ id: 1, deploymentID: 1, isDeleted: 1 });

const programsModel = newModel(mongoose.connection, 'v1::academic-portfolio_Programs', schema);

module.exports = { programsModel };
