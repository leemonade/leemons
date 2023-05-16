import { getMenuRequest } from '@menu-builder/request';
import hooks from 'leemons-hooks';

let menuCache = {};
let hooksActionsInit = false;

function resetMenu() {
  menuCache = {};
  hooks.fireEvent('menu-builder:reload-menu');
}

async function getMenu(key, force) {
  if (!hooksActionsInit) {
    hooks.addAction('menu-builder:reset-menu', resetMenu);
    hooks.addAction('user:change:profile', resetMenu);
    hooks.addAction('user:update:permissions', resetMenu);
    hooks.addAction('menu-builder:user:addCustomItem', resetMenu);
    hooks.addAction('menu-builder:user:updateItem', resetMenu);
    hooksActionsInit = true;
  }
  if (!menuCache[key] || force) {
    const { menu } = await getMenuRequest(key);
    menuCache[key] = menu;
  }
  return menuCache[key];
}

export default getMenu;
