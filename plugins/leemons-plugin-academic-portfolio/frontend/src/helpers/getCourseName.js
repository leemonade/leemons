export default function getCourseName(item) {
  if (Array.isArray(item)) {
    return item.map(getCourseName).join(', ');
  }

  return `${item?.index}º`;
}

export { getCourseName };
