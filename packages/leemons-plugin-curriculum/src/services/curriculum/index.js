const { addCurriculum } = require('./addCurriculum');
const { curriculumByIds } = require('./curriculumByIds');
const { listCurriculums } = require('./listCurriculums');
const {
  generateCurriculumNodesFromAcademicPortfolioByNodeLevels,
} = require('./generateCurriculumNodesFromAcademicPortfolioByNodeLevels');

module.exports = {
  addCurriculum,
  curriculumByIds,
  listCurriculums,
  generateCurriculumNodesFromAcademicPortfolioByNodeLevels,
};
