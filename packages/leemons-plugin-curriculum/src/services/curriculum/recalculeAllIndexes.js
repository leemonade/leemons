const _ = require('lodash');
const { table } = require('../tables');
const { curriculumByIds } = require('./curriculumByIds');
const { setDatasetValues } = require('../nodes/setDatasetValues');

async function recalculeItem(
  nodeLevelByIds,
  item,
  userSession,
  parents,
  config,
  { transacting } = {}
) {
  const nodeLevelSchema = nodeLevelByIds[item.nodeLevel]
    ? nodeLevelByIds[item.nodeLevel].schema.jsonSchema
    : null;

  if (item.formValues && nodeLevelSchema) {
    _.forIn(item.formValues, (value, key) => {
      const schemaProperty = nodeLevelSchema.properties[key];
      if (
        schemaProperty &&
        schemaProperty.frontConfig &&
        schemaProperty.frontConfig.type === 'list'
      ) {
        switch (schemaProperty.frontConfig.listType) {
          case 'style-1':
          case 'style-2':
            // eslint-disable-next-line no-param-reassign
            item.formValues[key] = _.map(value, (val, inx) => {
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
            break;
          default:
            break;
        }
      }
    });

    await setDatasetValues(item, userSession, item.formValues, { transacting });
  }

  if (item.childrens) {
    for (let i = 0, l = item.childrens.length; i < l; i++) {
      // eslint-disable-next-line no-await-in-loop
      await recalculeItem(
        nodeLevelByIds,
        item.childrens[i],
        userSession,
        parents.concat([item]),
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

      const nodeLevelByIds = _.keyBy(curriculum.nodeLevels, 'id');
      const config = { customIndexes: {} };
      for (let i = 0, l = curriculum.nodes.length; i < l; i++) {
        // eslint-disable-next-line no-await-in-loop
        await recalculeItem(nodeLevelByIds, curriculum.nodes[i], userSession, [], config, {
          transacting,
        });
      }
    },
    table.curriculums,
    _transacting
  );
}

module.exports = { recalculeAllIndexes };
