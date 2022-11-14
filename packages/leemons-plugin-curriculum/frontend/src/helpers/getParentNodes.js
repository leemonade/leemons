import _ from 'lodash';
import { getFlattenNodes } from '@curriculum/helpers/getFlattenNodes';

// eslint-disable-next-line import/prefer-default-export
export function getParentNodes(items, id) {
  const result = [];
  const flatNodes = getFlattenNodes(items);

  function getParent(item) {
    if (item.parentNode) {
      const parent = _.find(flatNodes, { id: item.parentNode });
      result.push(parent);
      getParent(parent);
    }
  }

  getParent(_.find(flatNodes, { id }));
  return result;
}
