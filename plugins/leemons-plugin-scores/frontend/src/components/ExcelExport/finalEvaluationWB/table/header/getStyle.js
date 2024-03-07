import { addCustomName } from '../../../helpers';

/* eslint-disable no-param-reassign */
export function getStyle({ ws, contentArray }) {
  return (cell, { relCol: col, relRow: row }) => {
    const border = {};

    const isLastRow = row === contentArray.length - 1;
    const isFirstCol = col === 0;

    const isContentCol = !isFirstCol && col < contentArray[row].length - 2;

    const isTypesRow = row === 0;
    const isSubjectRow = row === 1;
    const isEvaluationRow = row === 2;

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

    if (isFirstCol || isSubjectRow || (isLastRow && !isContentCol)) {
      cell.font = {
        bold: true,
      };
    }

    if (isTypesRow && isContentCol) {
      cell.dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: [`"partial, final"`],
        showErrorMessage: true,
      };
      addCustomName({ ws, name: 'types', cell });
    } else if (isEvaluationRow && isContentCol) {
      addCustomName({ ws, name: 'evaluations', cell });
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
