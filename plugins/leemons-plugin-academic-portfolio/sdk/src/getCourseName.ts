export function getCourseName(item: { name?: string; index: number }): string {
  if (!item) {
    return "";
  }

  return item.name ? `${item.name}` : `${item.index}º`;
}
