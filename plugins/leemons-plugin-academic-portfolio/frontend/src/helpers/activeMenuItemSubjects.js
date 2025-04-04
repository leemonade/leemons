import { enableMenuItemRequest } from "@academic-portfolio/request";
import hooks from "@leemons/hooks";

export async function activeMenuItemSubjects() {
  const itemKey = "subjects";
  await enableMenuItemRequest(itemKey);
  await hooks.fireEvent("menu-builder:user:updateItem", itemKey);
}
