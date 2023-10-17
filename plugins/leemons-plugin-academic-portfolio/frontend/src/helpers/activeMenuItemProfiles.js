import hooks from 'leemons-hooks';
import { enableMenuItemRequest } from '@academic-portfolio/request';

export async function activeMenuItemProfiles() {
  const itemKey = 'profiles';
  await enableMenuItemRequest(itemKey);
  await hooks.fireEvent('menu-builder:user:updateItem', itemKey);
}
