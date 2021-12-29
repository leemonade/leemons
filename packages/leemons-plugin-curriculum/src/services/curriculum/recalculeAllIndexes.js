/* eslint-disable no-param-reassign */
/* eslint-disable no-cond-assign */

const _ = require('lodash');
const { table } = require('../tables');
const { curriculumByIds } = require('./curriculumByIds');
const { setDatasetValues } = require('../nodes/setDatasetValues');
const { updateNodeLevelFormPermissions } = require('../nodeLevels/updateNodeLevelFormPermissions');

function compileTagifyText(text, replaces) {
  let finalText = _.clone(text);
  const regex = /(?:\[{2}\{).*?(?:\}\]{2})/g;

  let array;
  while ((array = regex.exec(text)) !== null) {
    const confObj = JSON.parse(array[0].slice(2, -2));

    if (confObj.nodeLevel && confObj.field) {
      finalText = finalText.replace(
        array[0],
        replaces[`${confObj.nodeLevel}:${confObj.field}`] || '(Value not found)'
      );
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
      config.indexes[`${nodeLevel.id}:numbering`] = '';
      break;
  }

  await table.nodes.update({ id: node.id }, node, { transacting });

  if (node.formValues && nodeLevelSchema) {
    _.forIn(node.formValues, (value, key) => {
      const schemaProperty = nodeLevelSchema.properties[key];
      if (schemaProperty && schemaProperty.frontConfig && schemaProperty.frontConfig.blockData) {
        if (schemaProperty.frontConfig.type === 'list') {
          switch (schemaProperty.frontConfig.listType) {
            case 'style-1':
            case 'style-2':
              node.formValues[key] = _.map(value, (val, inx) => {
                const index =
                  schemaProperty.frontConfig.listType === 'style-2'
                    ? global.utils.numberToEncodedLetter(inx + 1)
                    : inx + 1;
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
              console.log('Un custom');
              break;
            default:
              break;
          }
        } else if (
          schemaProperty.frontConfig.blockData.type === 'code' &&
          schemaProperty.frontConfig.blockData.codeType === 'autocomposed'
        ) {
          const text = compileTagifyText(
            schemaProperty.frontConfig.blockData.codeText,
            config.indexes
          );

          node.formValues[key] = {
            ...node.formValues[key],
            value: text,
            searchableValueString: text,
          };
        } else {
          config.indexes[`${nodeLevel.id}:${key}`] = value.value;
        }
      }
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

      const nodeLevelByIds = _.keyBy(curriculum.nodeLevels, 'id');
      const config = { indexes: {} };
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
