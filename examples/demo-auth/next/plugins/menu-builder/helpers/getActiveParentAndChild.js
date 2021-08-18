import * as _ from 'lodash';
import { getMenu } from '@menu-builder/helpers';
import Router from 'next/router';

async function getActiveParentAndChild(_key) {
  let key = _key;
  if (_.isNil(key)) key = 'plugins.menu-builder.main';
  const menu = await getMenu(key);
  const url = Router.router.route;
  const result = {
    parent: null,
    child: null,
  };
  _.forEach(menu, (parentItem) => {
    if (parentItem.url === url) {
      result.parent = parentItem;
    }
    _.forEach(parentItem.childrens, (childItem) => {
      if (childItem.url === url) {
        result.parent = parentItem;
        result.child = childItem;
        return false;
      }
    });
    if (result.parent) {
      return false;
    }
  });

  return result;
}

export default getActiveParentAndChild;
