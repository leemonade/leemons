async function getCourseName(item) {
  return item.name ? `${item.name}` : `${item.index}º`;
}

module.exports = { getCourseName };
