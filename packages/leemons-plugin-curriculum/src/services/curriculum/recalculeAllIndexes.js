/* eslint-disable no-param-reassign */
/* eslint-disable no-cond-assign */

const _ = require('lodash');
const { table } = require('../tables');
const { curriculumByIds } = require('./curriculumByIds');
const { setDatasetValues } = require('../nodes/setDatasetValues');
const { updateNodeLevelFormPermissions } = require('../nodeLevels/updateNodeLevelFormPermissions');
const {
  updateUserAgentPermissionsByUserSession,
} = require('../configs/updateUserAgentPermissionsByUserSession');

function processResetIndexes(config) {
  _.forEach(config.resetIndexesOnFinishCurrentLoop, (key) => {
    delete config.indexes[key];
  });
  config.resetIndexesOnFinishCurrentLoop = [];
}

function compileTagifyText(text, config, nodeLevel, field) {
  let finalText = _.clone(text);
  const regex = /(?:\[{2}\{).*?(?:\}\]{2})/g;

  let array;
  while ((array = regex.exec(text)) !== null) {
    const confObj = JSON.parse(array[0].slice(2, -2));

    // Remplazos de campos donde el valor ya esta almacenado
    if (confObj.nodeLevel && confObj.field) {
      finalText = finalText.replace(
        array[0],
        config.indexes[`${confObj.nodeLevel}:${confObj.field}`] || '(Value not found)'
      );

      // Listados donde hay que ir sumando los indices y estos pueden mantenerse en futura iteracciones
    } else if (confObj.numberingStyle) {
      // Si se configuro que no continuaran los indices se marca para que el indice se resetee en cada iteraccion
      if (!confObj.numberingContinueFromPrevious) {
        config.resetIndexesOnFinishCurrentLoop.push(`${nodeLevel}:${field}`);
      }
      let numberingDigits = 0;
      if (confObj.numberingStyle === 'style-1') {
        numberingDigits = confObj.numberingDigits || 0;
      }
      // Si aun no existe un valor lo creamos, siempre almacenamos el indice en formato numero, luego hacemos las transformaciones necesarias
      if (_.isNil(config.indexes[`${nodeLevel}:${field}`])) {
        config.indexes[`${nodeLevel}:${field}`] = 0;
      }
      // Se suma uno para que en cada iteraccion el indice sea el siguiente
      config.indexes[`${nodeLevel}:${field}`] += 1;

      // Segun el estilo elegido generamos segun el indice actual el valor a remplazar en el texto
      const toReplace =
        confObj.numberingStyle === 'style-2'
          ? global.utils.numberToEncodedLetter(config.indexes[`${nodeLevel}:${field}`])
          : config.indexes[`${nodeLevel}:${field}`];

      finalText = finalText.replace(array[0], toReplace.toString().padStart(numberingDigits, '0'));
    } else {
      finalText = finalText.replace(array[0], '(Value not found)');
    }
  }
  return finalText;
}

async function recalculeItem(
  nodeLevelByIds,
  node,
  nodeIndex,
  userSession,
  parents,
  config,
  { transacting } = {}
) {
  const nodeLevel = nodeLevelByIds[node.nodeLevel];
  const nodeLevelSchema = nodeLevel.schema ? nodeLevel.schema.jsonSchema : null;

  switch (nodeLevel.listType) {
    case 'style-1':
    case 'style-2':
      // eslint-disable-next-line no-param-reassign
      node.nameOrder =
        nodeLevel.listType === 'style-2'
          ? global.utils.numberToEncodedLetter(nodeIndex + 1)
          : nodeIndex + 1;
      // eslint-disable-next-line no-param-reassign
      node.fullName = `${node.nameOrder}. ${node.name}`;
      config.indexes[`${nodeLevel.id}:numbering`] = node.nameOrder;
      break;
    case 'custom':
      break;
    default:
      node.fullName = `${node.name}`;
      config.indexes[`${nodeLevel.id}:numbering`] = '';
      break;
  }

  await table.nodes.update({ id: node.id }, node, { transacting });

  if (node.formValues && nodeLevelSchema) {
    _.forIn(node.formValues, (value, key) => {
      const schemaProperty = nodeLevelSchema.properties[key];
      if (schemaProperty && schemaProperty.frontConfig && schemaProperty.frontConfig.blockData) {
        /* --- LIST / GROUP --- */

        if (
          schemaProperty.frontConfig.type === 'list' ||
          schemaProperty.frontConfig.type === 'group'
        ) {
          const ordered =
            schemaProperty.frontConfig.blockData.listOrdered ||
            schemaProperty.frontConfig.blockData.groupOrdered;
          const orderedText =
            schemaProperty.frontConfig.blockData.listOrderedText ||
            schemaProperty.frontConfig.blockData.groupOrderedText;
          switch (ordered) {
            case 'style-1':
            case 'style-2':
              node.formValues[key] = _.map(value, (val, inx) => {
                const index =
                  ordered === 'style-2' ? global.utils.numberToEncodedLetter(inx + 1) : inx + 1;
                return {
                  id: val.id,
                  value: val.value,
                  searchableValueString: `${index}. ${val.value}`,
                  metadata: {
                    index,
                  },
                };
              });
              break;
            case 'custom':
              node.formValues[key] = _.map(value, (val) => {
                const index = compileTagifyText(orderedText, config, nodeLevel.id, key);
                return {
                  id: val.id,
                  value: val.value,
                  searchableValueString: `${index}. ${val.value}`,
                  metadata: {
                    index,
                  },
                };
              });
              break;
            default:
              node.formValues[key] = _.isArray(value) ? value : [];
              break;
          }
        } else if (
          /* --- CODE --- */
          schemaProperty.frontConfig.blockData.type === 'code' &&
          schemaProperty.frontConfig.blockData.codeType === 'autocomposed'
        ) {
          const text = compileTagifyText(
            schemaProperty.frontConfig.blockData.codeText,
            config,
            nodeLevel.id,
            key
          );

          node.formValues[key] = {
            ...node.formValues[key],
            value: text,
            searchableValueString: text,
          };
        } else {
          config.indexes[`${nodeLevel.id}:${key}`] = value?.value;
        }
      }

      processResetIndexes(config);
    });

    await setDatasetValues(node, userSession, node.formValues, { transacting });
  }

  if (node.childrens) {
    for (let i = 0, l = node.childrens.length; i < l; i++) {
      // eslint-disable-next-line no-await-in-loop
      await recalculeItem(
        nodeLevelByIds,
        node.childrens[i],
        i,
        userSession,
        parents.concat([node]),
        config,
        { transacting }
      );
    }
  }
}

async function recalculeAllIndexes(curriculumId, userSession, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const [curriculum] = await curriculumByIds([curriculumId], { userSession, transacting });

      await Promise.all(
        _.map(curriculum.nodeLevels, ({ id }) =>
          updateNodeLevelFormPermissions(id, { transacting })
        )
      );

      await updateUserAgentPermissionsByUserSession(userSession, { transacting });

      const nodeLevelByIds = _.keyBy(curriculum.nodeLevels, 'id');
      const config = { indexes: {}, resetIndexesOnFinishCurrentLoop: [] };
      for (let i = 0, l = curriculum.nodes.length; i < l; i++) {
        // eslint-disable-next-line no-await-in-loop
        await recalculeItem(nodeLevelByIds, curriculum.nodes[i], i, userSession, [], config, {
          transacting,
        });
      }
    },
    table.curriculums,
    _transacting
  );
}

module.exports = { recalculeAllIndexes };
