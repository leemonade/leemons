import { getMenuRequest } from '@menu-builder/request';

let menuCache;

async function getMenu(key, force) {
  if (!menuCache || force) {
    const { menu } = await getMenuRequest(key);
    menuCache = menu;
  }
  return menuCache;
}

export default getMenu;
