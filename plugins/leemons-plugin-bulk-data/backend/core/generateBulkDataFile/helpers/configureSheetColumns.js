const { mergeByPath } = require('./mergeGroupTitleCells');
const { styleCell } = require('./styleCell');

const getItemSecondaryFontColor = (item) => {
  if (!item.style?.bgColor) return item;
  if (item.style.bgColor.startsWith('light')) {
    return {
      ...item,
      style: { ...item.style, fontColor: item.style.bgColor.replace('light', '').toLowerCase() },
    };
  }
  return {
    ...item,
    style: {
      ...item.style,
      fontColor: `light${item.style.bgColor.charAt(0).toUpperCase() + item.style.bgColor.slice(1)}`,
    },
  };
};

/* eslint-disable no-param-reassign */
function addStyledRow({
  worksheet,
  columnDefinitions,
  currentRow,
  keyExtractor,
  valueExtractor,
  pathToMergeBy,
  centerText = true,
}) {
  worksheet.addRow(
    Object.keys(columnDefinitions).reduce((acc, key) => {
      acc[key] = keyExtractor(columnDefinitions[key]);
      return acc;
    }, {})
  );
  currentRow++;

  if (pathToMergeBy) {
    mergeByPath({
      columnDefinitionsObject: columnDefinitions,
      path: pathToMergeBy,
      worksheet,
      row: currentRow,
    });
  }

  worksheet.getRow(currentRow).eachCell((cell, colNumber) => {
    const columnKey = worksheet.columns[colNumber - 1].key;
    const { style = {}, note } = valueExtractor(columnDefinitions[columnKey]);

    styleCell({
      cell,
      fontColor: style.fontColor,
      bgColor: style.bgColor,
      alignment: centerText ? { horizontal: 'center', vertical: 'center' } : undefined,
    });
    if (note) {
      cell.note = note;
    }
  });

  return currentRow;
}

function configureSheetColumns({
  worksheet,
  columnDefinitions,
  offset = 0,
  withGroupedTitles,
  addTitleKeysRow = false,
  addGroupTitleKeysRow = false,
  modifyColumnHeaders,
}) {
  worksheet.columns = Object.entries(columnDefinitions).map(([key, { width }]) => ({
    header: key,
    key,
    width,
  }));
  if (modifyColumnHeaders) {
    modifyColumnHeaders(worksheet);
  }

  for (let i = 0; i < offset; i++) {
    worksheet.addRow({});
  }
  let currentRow = 1 + offset;

  if (withGroupedTitles) {
    if (addGroupTitleKeysRow) {
      currentRow = addStyledRow({
        worksheet,
        columnDefinitions,
        currentRow,
        keyExtractor: (item) => item.groupTitle?.key ?? '',
        valueExtractor: (item) => getItemSecondaryFontColor(item.groupTitle || {}),
        pathToMergeBy: 'groupTitle.key',
      });
    }

    currentRow = addStyledRow({
      worksheet,
      columnDefinitions,
      currentRow,
      keyExtractor: (item) => item.groupTitle?.title ?? '',
      valueExtractor: (item) => item.groupTitle || {},
      pathToMergeBy: 'groupTitle.title',
    });
  }

  if (addTitleKeysRow) {
    currentRow = addStyledRow({
      worksheet,
      columnDefinitions,
      currentRow,
      keyExtractor: (item) => item.key,
      valueExtractor: (item) => getItemSecondaryFontColor(item),
    });
  }

  addStyledRow({
    worksheet,
    columnDefinitions,
    currentRow,
    keyExtractor: (item) => item.title,
    valueExtractor: (item) => item,
  });
}

module.exports = { configureSheetColumns };
