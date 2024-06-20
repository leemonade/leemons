const mergeByPath = ({ columnDefinitionsObject, path, worksheet, row = 2 }) => {
  const groupRanges = {};

  Object.entries(columnDefinitionsObject).forEach(([, value], index) => {
    const pathParts = path.split('.');
    const criteriaValue = pathParts.reduce((acc, part) => (acc ? acc[part] : undefined), value);

    if (criteriaValue) {
      if (!groupRanges[criteriaValue]) {
        groupRanges[criteriaValue] = { start: index + 1, end: index + 1 };
      } else {
        groupRanges[criteriaValue].end = index + 1;
      }
    }
  });

  Object.values(groupRanges).forEach(({ start, end }) => {
    if (start !== end) {
      worksheet.mergeCells(row, start, row, end);
    }
  });
};

module.exports = { mergeByPath };
