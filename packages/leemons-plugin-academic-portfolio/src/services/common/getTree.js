/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');
const { getProgramCourses } = require('../programs/getProgramCourses');
const { getProgramGroups } = require('../programs/getProgramGroups');
const { listClasses } = require('../classes/listClasses');
const { getProgramSubstages } = require('../programs/getProgramSubstages');
const { getProgramKnowledges } = require('../programs/getProgramKnowledges');
const { getProgramSubjects } = require('../programs/getProgramSubjects');
const { getProgramSubjectTypes } = require('../programs/getProgramSubjectTypes');
const { getManagers } = require('../managers/getManagers');
const { getProgramCycles } = require('../programs/getProgramCycles');
const { getClassesProgramInfo } = require('../classes/listSessionClasses');

async function getTree(nodeTypes, { program, transacting } = {}) {
  const query = {};
  if (program && !_.isEmpty(program)) {
    query.program = program;
  }

  const programCenter = await table.programCenter.find(query, { transacting });
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
    { items: _classes },
    cycles,
  ] = await Promise.all([
    table.programs.find({ id_$in: programIds }, { transacting }),
    leemons.getPlugin('users').services.centers.list(0, 9999, { transacting }),
    getProgramCourses(programIds, { transacting }),
    getProgramGroups(programIds, { transacting }),
    getProgramSubstages(programIds, { transacting }),
    getProgramKnowledges(programIds, { transacting }),
    getProgramSubjects(programIds, { transacting }),
    getProgramSubjectTypes(programIds, { transacting }),
    listClasses(0, 99999, undefined, { query: { program_$in: programIds }, transacting }),
    getProgramCycles(programIds, { transacting }),
  ]);

  let classes = _classes;
  if (programIds?.length) {
    classes = await getClassesProgramInfo(
      {
        programs: programIds,
        classes,
      },
      { transacting }
    );
  }

  let managerIds = [];
  managerIds = managerIds.concat(_.map(programs, 'id'));
  managerIds = managerIds.concat(_.map(courses, 'id'));
  managerIds = managerIds.concat(_.map(groups, 'id'));
  managerIds = managerIds.concat(_.map(substages, 'id'));
  managerIds = managerIds.concat(_.map(knowledges, 'id'));
  managerIds = managerIds.concat(_.map(subjects, 'id'));
  managerIds = managerIds.concat(_.map(subjectTypes, 'id'));
  managerIds = managerIds.concat(_.map(cycles, 'id'));

  const managers = await getManagers(managerIds, { transacting, returnAgents: false });
  const managersByRelationship = _.groupBy(managers, 'relationship');

  function process(items) {
    _.forEach(items, (item) => {
      // eslint-disable-next-line no-param-reassign
      item.managers = managersByRelationship[item.id]
        ? _.map(managersByRelationship[item.id], 'userAgent')
        : [];
    });
  }

  process(programs);
  process(courses);
  process(groups);
  process(substages);
  process(knowledges);
  process(subjects);
  process(subjectTypes);
  process(cycles);

  const classCoursesIds = _.flatten(
    _.map(classes, (classe) => {
      if (classe.courses) {
        if (_.isArray(classe.courses)) {
          return _.map(classe.courses, 'id');
        }
        return classe.courses.id;
      }
      return undefined;
    })
  );

  // ES: Comprobamos si subjectType.groupVisibility es true si lo es, borramos el grupo de la clase para que cuando se monte el arbol no salga el grupo
  _.forEach(classes, (classe) => {
    if (classe.subjectType.groupVisibility) {
      classe._groups = classe.groups;
      classe.groups = null;
    } else if (nodeTypes.includes('groups')) {
      classe._knowledges = classe.knowledges;
      classe.knowledges = null;
    }
  });

  const classGroupsIds = _.map(classes, 'groups.id');
  const classSubstagesIds = _.map(classes, 'substages.id');
  const classKnowledgesIds = _.map(classes, 'knowledges.id');
  const classSubjectIds = _.map(classes, 'subject.id');
  const classSubjectTypeIds = _.map(classes, 'subjectType.id');

  // ES: Cogemos los nodos sin usar en las clases para posteriormente ponerlos al nivel del programa
  const groupsUnused = _.filter(groups, ({ id }) => classGroupsIds.indexOf(id) < 0);
  const coursesUnused = _.filter(courses, ({ id }) => classCoursesIds.indexOf(id) < 0);
  const substagesUnused = _.filter(substages, ({ id }) => classSubstagesIds.indexOf(id) < 0);
  const knowledgesUnused = _.filter(knowledges, ({ id }) => classKnowledgesIds.indexOf(id) < 0);
  const subjectsUnused = _.filter(subjects, ({ id }) => classSubjectIds.indexOf(id) < 0);
  const subjectTypeUnused = _.filter(subjectTypes, ({ id }) => classSubjectTypeIds.indexOf(id) < 0);

  const unusedNodesByProgram = {
    courses: _.groupBy(coursesUnused, 'program'),
    groups: _.groupBy(groupsUnused, 'program'),
    substage: _.groupBy(substagesUnused, 'program'),
    knowledges: _.groupBy(knowledgesUnused, 'program'),
    subjectType: _.groupBy(subjectTypeUnused, 'program'),
    subject: _.groupBy(subjectsUnused, 'program'),
  };

  const centersByProgram = _.groupBy(programCenter, 'program');

  const nodesByIds = {
    center: _.keyBy(centers.items, 'id'),
    program: _.keyBy(programs, 'id'),
    courses: _.keyBy(courses, 'id'),
    groups: _.keyBy(groups, 'id'),
    substage: _.keyBy(substages, 'id'),
    knowledges: _.keyBy(knowledges, 'id'),
    subjectType: _.keyBy(subjectTypes, 'id'),
    subject: _.keyBy(subjects, 'id'),
    cycles: _.keyBy(cycles, 'id'),
  };

  function getCycleByCourse(courseId) {
    let cycle = null;
    _.forEach(cycles, (cy) => {
      if (cy.courses.includes(courseId)) {
        cycle = cy;
        return false;
      }
    });
    return cycle;
  }

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
    nodeTypes.forEach((nodeType, index) => {
      if (classroom[nodeType]) {
        const id = _.isString(classroom[nodeType]) ? classroom[nodeType] : classroom[nodeType].id;
        if (nodeType === 'courses') {
          if (nodesByIds.courses[id]) {
            const proId = nodesByIds.courses[id].program;
            const proCourses = _.filter(courses, { program: proId });
            if (proCourses.length > 1 && nodeTypes[index - 1] === 'cycles') {
              const cycle = getCycleByCourse(id);
              if (cycle) {
                nodes.push({
                  type: 'cycles',
                  id: cycle.id,
                });
              }
            }
            if (proCourses.length > 1) {
              nodes.push({
                type: nodeType,
                id,
              });
            }
          }
        } else if (nodeType === 'groups') {
          const pro = nodesByIds.program[nodesByIds.groups[id].program];
          if (!pro.useOneStudentGroup) {
            nodes.push({
              type: nodeType,
              id,
            });
          }
        } else {
          nodes.push({
            type: nodeType,
            id,
          });
        }
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
  const getNodeObjectKeysAsArray = (node, parentNodeType, parentNodeId) => {
    let nodes = [];
    _.forIn(node, (value, key) => {
      if (key === 'classrooms') {
        if (value.length > 0) {
          nodes = _.map(value, ({ _groups, _knowledges, ...v }) => {
            const r = {
              nodeType: 'class',
              value: { ...v },
            };
            if (_groups) {
              r.value.groups = _groups;
            }
            if (_knowledges) {
              r.value.knowledges = _knowledges;
            }
            return r;
          });
        }
      } else {
        const keyParse = key.split('|');
        const nodeType = keyParse[0];
        const nodeId = keyParse[1];
        nodes.push({
          nodeType,
          value: nodesByIds[nodeType][nodeId],
          childrens: getNodeObjectKeysAsArray(value, nodeType, nodeId),
        });
      }
    });
    // ES: Añadimos al programa los nodos que no están asignados a ninguna clase
    if (
      parentNodeType &&
      parentNodeId &&
      nodeTypes.indexOf('program') >= 0 &&
      parentNodeType === 'program'
    ) {
      _.forEach(nodeTypes, (nodeType) => {
        if (
          unusedNodesByProgram[nodeType] &&
          _.isArray(unusedNodesByProgram[nodeType][parentNodeId])
        ) {
          _.forEach(unusedNodesByProgram[nodeType][parentNodeId], (item) => {
            nodes.push({
              nodeType,
              value: item,
              childrens: [],
            });
          });
        }
      });
    }

    // TODO: Check if just "filtering" nodes, is enough
    return _.sortBy(
      nodes.filter((n) => !_.isNil(n) && !_.isNil(n.value)),
      (n) => n.value.index || n.value.name
    );
  };

  function setTreeIds(nodes, parentId) {
    _.forEach(nodes, (node, i) => {
      // eslint-disable-next-line no-param-reassign
      node.treeId = `${parentId ? `${parentId}.` : ''}${i}|${node.nodeType}|${node.value.id}`;
      if (node.childrens) {
        // eslint-disable-next-line no-param-reassign
        node.childrens = _.orderBy(
          node.childrens,
          ['value.subject.internalId', 'value.subject.name', 'value.name'],
          ['asc', 'asc', 'asc']
        );
        setTreeIds(node.childrens, node.treeId);
      }
    });
    return nodes;
  }

  return setTreeIds(getNodeObjectKeysAsArray(tree));
}

module.exports = { getTree };
