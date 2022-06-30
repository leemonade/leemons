import hooks from 'leemons-hooks';
import { enableMenuItemRequest } from '@grades/request';

export async function activeMenuItemDependencies() {
  const itemKey = 'dependencies';
  await enableMenuItemRequest(itemKey);
  await hooks.fireEvent('menu-builder:user:updateItem', itemKey);
}
