import { enableMenuItemRequest } from "@academic-portfolio/request";
import hooks from "@leemons/hooks";

export async function activeMenuItemPrograms() {
  const itemKey = "programs";
  await enableMenuItemRequest(itemKey);
  await hooks.fireEvent("menu-builder:user:updateItem", itemKey);
}
