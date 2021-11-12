const _ = require('lodash');
const { table } = require('../tables');
const { getProgramCourses } = require('../programs/getProgramCourses');
const { getProgramGroups } = require('../programs/getProgramGroups');
const { listClasses } = require('../classes/listClasses');
const { getProgramSubstages } = require('../programs/getProgramSubstages');
const { getProgramKnowledges } = require('../programs/getProgramKnowledges');
const { getProgramSubjects } = require('../programs/getProgramSubjects');
const { getProgramSubjectTypes } = require('../programs/getProgramSubjectTypes');

async function getTree(nodeTypes, { transacting } = {}) {
  const programCenter = await table.programCenter.find({}, { transacting });
  const programIds = _.map(programCenter, 'program');
  const [
    programs,
    centers,
    courses,
    groups,
    substages,
    knowledges,
    subjects,
    subjectTypes,
    { items: classes },
  ] = await Promise.all([
    table.programs.find({ id_$in: programIds }, { transacting }),
    leemons.getPlugin('users').services.centers.list(0, 9999, { transacting }),
    getProgramCourses(programIds, { transacting }),
    getProgramGroups(programIds, { transacting }),
    getProgramSubstages(programIds, { transacting }),
    getProgramKnowledges(programIds, { transacting }),
    getProgramSubjects(programIds, { transacting }),
    getProgramSubjectTypes(programIds, { transacting }),
    listClasses(0, 9999, undefined, { query: { program_$in: programIds }, transacting }),
  ]);

  const centersByProgram = _.groupBy(programCenter, 'program');

  const programByIds = _.keyBy(programs, 'id');
  const centerByIds = _.keyBy(centers.items, 'id');
  const courseByIds = _.keyBy(courses, 'id');
  const groupByIds = _.keyBy(groups, 'id');
  const substageByIds = _.keyBy(substages, 'id');
  const knowledgeByIds = _.keyBy(knowledges, 'id');
  const subjectTypeByIds = _.keyBy(subjectTypes, 'id');
  const subjectByIds = _.keyBy(subjects, 'id');
  const nodesByIds = {
    center: centerByIds,
    program: programByIds,
    courses: courseByIds,
    groups: groupByIds,
    substage: substageByIds,
    knowledges: knowledgeByIds,
    subjectType: subjectTypeByIds,
    subject: subjectByIds,
  };

  // ES: Inicializamos el árbol
  const tree = {};

  const finalClasses = [];
  // ES: Añadimos a cada clase tu centro, si hay mas de un centro toca duplicar la clase por cada centro
  _.forEach(classes, (classe) => {
    _.forEach(centersByProgram[classe.program], ({ center }) => {
      finalClasses.push({ center, ...classe });
    });
  });

  // ES: Nos recorremos todas las clases, y en función de los nodeTypes vamos creando el árbol
  _.forEach(finalClasses, (classroom) => {
    // ES: Vamos a almacenar la profundidad del árbol que nos llega en el nodeTypes, en función de la clase
    const nodes = [];
    nodeTypes.forEach((nodeType) => {
      if (classroom[nodeType]) {
        nodes.push({ type: nodeType, id: classroom[nodeType] });
      }
    });

    // ES: Ahora ya tenemos un array con la profundidad del árbol para esta clase vamos a comprobar que ya existen los nodos en el Tree
    let currentTreeNode = tree;
    for (let i = 0, l = nodes.length; i < l; i++) {
      const node = `${nodes[i].type}|${nodes[i].id}`;
      if (currentTreeNode[node] === undefined) {
        currentTreeNode[node] = { classrooms: [] };
      }
      currentTreeNode = currentTreeNode[node];
    }

    // ES: Una vez creados los nodos en el árbol, vamos a asignar la clase a su nodo
    currentTreeNode.classrooms.push(classroom);
  });

  // ES: Ahora vamos a recorrer el árbol y a generar el arbol final con la información de cada nodo
  const getNodeObjectKeysAsArray = (node) => {
    let nodes = [];
    _.forIn(node, (value, key) => {
      if (key === 'classrooms') {
        if (value.length > 0) nodes = _.map(value, (v) => ({ nodeType: 'class', value: v }));
      } else {
        const keyParse = key.split('|');
        const nodeType = keyParse[0];
        const nodeId = keyParse[1];
        nodes.push({
          nodeType,
          value: nodesByIds[nodeType][nodeId],
          childrens: getNodeObjectKeysAsArray(value),
        });
      }
    });
    return nodes;
  };

  return getNodeObjectKeysAsArray(tree);
}

module.exports = { getTree };
