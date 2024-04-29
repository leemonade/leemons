function getCourseName(item) {
  if (!item) {
    return '';
  }

  return item.name ? `${item.name}` : `${item.index}º`;
}

module.exports = { getCourseName };
