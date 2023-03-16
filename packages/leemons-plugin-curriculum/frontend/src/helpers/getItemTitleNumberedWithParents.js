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
          const parentValueIndex = _.findIndex(nodeValue.value, {
            id: values.metadata.parentRelated,
          });
          parentTitle = getItemTitleNumbered(parentBlockData, nodeValue, parentValueIndex);
        }

        if (parentBlockData.type === 'group') {
          const ids = values.metadata.parentRelated.split('|');
          const valIndex = _.findIndex(Object.values(nodeValue.value), {
            id: ids[1],
          });

          const valItem = _.find(parentBlockData.elements, {
            id: Object.keys(nodeValue.value)[valIndex],
          });

          if (ids.length > 2) {
            const val = Object.values(nodeValue.value)[valIndex];
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
            parentTitle = getItemTitleNumbered(parentBlockData, nodeValue, valIndex, true, valItem);
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
