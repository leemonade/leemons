const { addCurriculum } = require('./addCurriculum');
const { curriculumByIds } = require('./curriculumByIds');
const { listCurriculums } = require('./listCurriculums');
const { recalculeAllIndexes } = require('./recalculeAllIndexes');
const {
  generateCurriculumNodesFromAcademicPortfolioByNodeLevels,
} = require('./generateCurriculumNodesFromAcademicPortfolioByNodeLevels');

module.exports = {
  addCurriculum,
  curriculumByIds,
  listCurriculums,
  recalculeAllIndexes,
  generateCurriculumNodesFromAcademicPortfolioByNodeLevels,
};
