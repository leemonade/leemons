import { addCustomName } from '../../../helpers';

/* eslint-disable no-param-reassign */
export function getStyle({ ws, contentArray, labels }) {
  return (cell, { relCol: col, relRow: row }) => {
    const border = {};

    const isFirstRow = row === 0;
    const isLastRow = row === contentArray.length - 1;
    const isFirstCol = col === 0;

    const isContentCol = !isFirstCol && col < contentArray[row].length - 2;

    const isTypesRow = row === 1;
    const isActivityNameRow = row === 2;
    const isDeadlineRow = row === 3;
    const isWeightRow = row === 4;

    if (isLastRow) {
      border.bottom = { style: 'medium', color: { argb: '3C84C6' } };
    }

    if (isFirstCol) {
      border.right = { style: 'medium', color: { argb: '3C84C6' } };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'right',
      };
    } else {
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true,
      };
    }

    if (isFirstCol || isActivityNameRow || (isLastRow && !isContentCol)) {
      cell.font = {
        bold: true,
      };
    }

    if (isFirstRow && isContentCol) {
      addCustomName({ ws, name: 'roles', cell });
    } else if (isTypesRow && isContentCol) {
      addCustomName({ ws, name: 'types', cell });
      cell.dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: [`"${labels.calificable}, ${labels.noCalificable}"`],
        showErrorMessage: true,
      };
    } else if (isActivityNameRow && isContentCol) {
      addCustomName({ ws, name: 'activities', cell });
    } else if (isDeadlineRow && isContentCol) {
      addCustomName({ ws, name: 'deadlines', cell });
    } else if (isWeightRow && isContentCol) {
      addCustomName({ ws, name: 'weights', cell });
      cell.numFmt = '0.00%';
    }

    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F1F9FE' },
    };

    cell.border = border;
  };
}

export default getStyle;
