export default function getCourseName(item) {
  if (Array.isArray(item)) {
    return item.map(getCourseName).join(', ');
  }

  return item?.name ? `${item?.name}` : `${item?.index}º`;
}

export { getCourseName };
