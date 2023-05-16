import hooks from 'leemons-hooks';
import { enableMenuItemRequest } from '@grades/request';

export async function activeMenuItemEvaluations() {
  const itemKey = 'evaluations';
  await enableMenuItemRequest(itemKey);
  await hooks.fireEvent('menu-builder:user:updateItem', itemKey);
}
