import { enableMenuItemRequest } from "@grades/request";
import hooks from "@leemons/hooks";

export async function activeMenuItemPromotions() {
  const itemKey = "promotions";
  await enableMenuItemRequest(itemKey);
  await hooks.fireEvent("menu-builder:user:updateItem", itemKey);
}
