import { enableMenuItemRequest } from "@grades/request";
import hooks from "@leemons/hooks";

export async function activeMenuItemDependencies() {
  const itemKey = "dependencies";
  await enableMenuItemRequest(itemKey);
  await hooks.fireEvent("menu-builder:user:updateItem", itemKey);
}
