const { addCurriculum } = require('./addCurriculum');
const { getDataForKeys } = require('./getDataForKeys');
const { curriculumByIds } = require('./curriculumByIds');
const { listCurriculums } = require('./listCurriculums');
const { recalculeAllIndexes } = require('./recalculeAllIndexes');
const {
  generateCurriculumNodesFromAcademicPortfolioByNodeLevels,
} = require('./generateCurriculumNodesFromAcademicPortfolioByNodeLevels');

module.exports = {
  addCurriculum,
  getDataForKeys,
  curriculumByIds,
  listCurriculums,
  recalculeAllIndexes,
  generateCurriculumNodesFromAcademicPortfolioByNodeLevels,
};
