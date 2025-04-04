import { enableMenuItemRequest } from "@grades/request";
import hooks from "@leemons/hooks";

export async function activeMenuItemEvaluations() {
  const itemKey = "evaluations";
  await enableMenuItemRequest(itemKey);
  await hooks.fireEvent("menu-builder:user:updateItem", itemKey);
}
