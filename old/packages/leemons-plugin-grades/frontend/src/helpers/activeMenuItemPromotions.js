import hooks from 'leemons-hooks';
import { enableMenuItemRequest } from '@grades/request';

export async function activeMenuItemPromotions() {
  const itemKey = 'promotions';
  await enableMenuItemRequest(itemKey);
  await hooks.fireEvent('menu-builder:user:updateItem', itemKey);
}
