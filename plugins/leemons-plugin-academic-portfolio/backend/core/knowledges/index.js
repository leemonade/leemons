const { addKnowledgeArea } = require('./addKnowledgeArea');
const { listKnowledgeAreas } = require('./listKnowledgeAreas');
const { updateKnowledgeArea } = require('./updateKnowledgeArea');
const { existKnowledgeInProgram } = require('./existKnowledgeInProgram');
const { existsInCenter } = require('./existsInCenter');

module.exports = {
  addKnowledgeArea,
  listKnowledgeAreas,
  updateKnowledgeArea,
  existKnowledgeInProgram,
  knowledgeAreaExistsInCenter: existsInCenter,
};
