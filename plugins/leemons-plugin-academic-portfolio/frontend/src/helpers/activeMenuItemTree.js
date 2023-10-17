import hooks from 'leemons-hooks';
import { enableMenuItemRequest } from '@academic-portfolio/request';

export async function activeMenuItemTree() {
  const itemKey = 'tree';
  await enableMenuItemRequest(itemKey);
  await hooks.fireEvent('menu-builder:user:updateItem', itemKey);
}
