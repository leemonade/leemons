export default function getCourseName(item) {
  return item?.name ? `${item?.name}` : `${item?.index}º`;
}

export { getCourseName };
