import hooks from 'leemons-hooks';
import { enableMenuItemRequest } from '@academic-portfolio/request';

export async function activeMenuItemSubjects() {
  const itemKey = 'subjects';
  await enableMenuItemRequest(itemKey);
  await hooks.fireEvent('menu-builder:user:updateItem', itemKey);
}
