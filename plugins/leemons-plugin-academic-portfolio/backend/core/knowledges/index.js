const { addKnowledgeArea } = require('./addKnowledgeArea');
const { listKnowledgeAreas } = require('./listKnowledgeAreas');
const { updateKnowledgeArea } = require('./updateKnowledgeArea');
const { existKnowledgeInProgram } = require('./existKnowledgeInProgram');
const { existsInCenter } = require('./existsInCenter');
const { getKnowledgeAreaById } = require('./getKnowledgeAreaById');
const { getKnowledgeAreasBySubjects } = require('./getKnowledgeAreasBySubjects');

module.exports = {
  getKnowledgeAreaById,
  getKnowledgeAreasBySubjects,
  addKnowledgeArea,
  listKnowledgeAreas,
  updateKnowledgeArea,
  existKnowledgeInProgram,
  knowledgeAreaExistsInCenter: existsInCenter,
};
