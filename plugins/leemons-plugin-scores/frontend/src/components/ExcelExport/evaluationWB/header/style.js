/* eslint-disable no-param-reassign */
export function getStyle(contentArray) {
  return (cell, { relCol: col, relRow: row }) => {
    const border = {};

    const isFirstRow = row === 0;
    const isLastRow = row === contentArray.length - 1;
    const isFirstCol = col === 0;
    const isLastCol = col === contentArray[row].length - 1;

    if (isFirstRow) {
      border.top = { style: 'medium' };
    }

    if (isLastRow) {
      border.bottom = { style: 'medium' };
    }

    if (isFirstCol) {
      border.left = { style: 'medium' };
    }

    if (isLastCol) {
      border.right = { style: 'medium' };
    }

    cell.border = border;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: isFirstCol ? 'EFEFEF' : 'FFFFFF' },
    };
  };
}

export default getStyle;
