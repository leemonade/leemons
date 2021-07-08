import { getMenuRequest } from '@menu-builder/request';
import hooks from 'leemons-hooks';

let menuCache;
let hooksActionsInit = false;

function onUserChangeProfile() {
  menuCache = null;
}

async function getMenu(key, force) {
  if (!hooksActionsInit) {
    hooks.addAction('user:change:profile', onUserChangeProfile);
    hooksActionsInit = true;
  }
  if (!menuCache || force) {
    const { menu } = await getMenuRequest(key);
    menuCache = menu;
  }
  return menuCache;
}

export default getMenu;
