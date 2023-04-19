import { getParentNodeIfHave } from '@curriculum/components/FormTheme/ParentRelation';
import { getItemTitleNumbered } from '@curriculum/helpers/getItemTitleNumbered';
import { getParentNodes } from '@curriculum/helpers/getParentNodes';
import _ from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export function getItemTitleNumberedWithParents(
  curriculum,
  blockData,
  id,
  values,
  index,
  item,
  onlyGetParent
) {
  let parentTitle = '';
  if (values?.metadata?.parentRelated) {
    const parents = getParentNodes(curriculum.nodes, id);
    const { nodeValue, nodeLevelId, formValueId } = getParentNodeIfHave(blockData, parents);
    const nodeLevel = _.find(curriculum.nodeLevels, { id: nodeLevelId });
    if (nodeLevel) {
      const parentBlockData =
        nodeLevel.schema.compileJsonSchema.properties[formValueId].frontConfig.blockData;
      if (parentBlockData) {
        if (parentBlockData.type === 'list') {
          let parentValueIndex;
          let nValue;
          const nodeValues = _.isArray(nodeValue) ? nodeValue : [nodeValue];
          _.forEach(nodeValues, (_nodeValue) => {
            parentValueIndex = _.findIndex(_nodeValue.value, {
              id: values.metadata.parentRelated,
            });
            if (parentValueIndex >= 0) {
              nValue = _nodeValue;
              return false;
            }
          });

          if (parentValueIndex >= 0 && nValue) {
            parentTitle = getItemTitleNumbered(parentBlockData, nValue, parentValueIndex);
          }
        }

        if (parentBlockData.type === 'group') {
          const ids = values.metadata.parentRelated.split('|');
          const nodeValues = _.isArray(nodeValue) ? nodeValue : [nodeValue];

          let valIndex;
          let nValue;
          _.forEach(nodeValues, (_nodeValue) => {
            valIndex = _.findIndex(Object.values(_nodeValue.value), {
              id: ids[1],
            });
            if (valIndex >= 0) {
              nValue = _nodeValue;
              return false;
            }
          });

          if (valIndex >= 0 && nValue) {
            const valItem = _.find(parentBlockData.elements, {
              id: Object.keys(nValue.value)[valIndex],
            });

            if (ids.length > 2) {
              const val = Object.values(nValue.value)[valIndex];
              const parentValueIndex = _.findIndex(val.value, {
                id: ids[2],
              });
              parentTitle = getItemTitleNumbered(
                parentBlockData,
                val,
                parentValueIndex,
                true,
                valItem
              );
            } else {
              parentTitle = getItemTitleNumbered(parentBlockData, nValue, valIndex, true, valItem);
            }
          }
        }
      }
    }
    if (onlyGetParent) return parentTitle;
  }
  const title = getItemTitleNumbered(blockData, values, index, false, item);
  if (title) return `${parentTitle ? `${parentTitle}.` : ''}${title}`;
  return null;
}
