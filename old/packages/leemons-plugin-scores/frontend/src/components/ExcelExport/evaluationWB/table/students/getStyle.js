import { addCustomName } from '../../../helpers';

/* eslint-disable no-param-reassign */
export default function getStyle({ tableData, ws }) {
  return (cell, { relRow: row, relCol: col, row: absoluteRow, col: absoluteCol }) => {
    const border = {};

    const studentDataLength = 2;

    const isFirstRow = row === 0;
    const isFirstScoreRow = row === 1;

    const isLastStudentDataCol = col === studentDataLength - 1;
    const isStudentDataCol = col < studentDataLength;

    const isScoreCol = !isStudentDataCol && col < tableData.activities.length + studentDataLength;

    const isCalculatedScoreCel = col === tableData.activities.length + studentDataLength;
    const isCustomScoreCel = col === tableData.activities.length + studentDataLength + 1;

    if (isFirstRow && isStudentDataCol) {
      cell.font = {
        bold: true,
      };
    }

    if (isLastStudentDataCol) {
      border.right = {
        style: 'medium',
        color: {
          argb: '3C84C6',
        },
      };
    }
    if (isFirstRow) {
      border.top = {
        style: 'medium',
        color: {
          argb: '3C84C6',
        },
      };
    }

    if (isScoreCol) {
      if (isFirstRow) {
        const upperCell = ws.getCell(absoluteRow - 1, absoluteCol);
        addCustomName({ ws, name: 'scores', cell: upperCell });
      }

      addCustomName({ ws, name: 'scores', cell });
      addCustomName({ ws, name: `scores_${row}`, cell });

      cell.numFmt = '0.00';
    }

    if (!isStudentDataCol && isFirstScoreRow) {
      const upperCell = ws.getCell(absoluteRow - 1, absoluteCol);
      upperCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F1F9FE' },
      };
    }

    if (!isStudentDataCol) {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
    }

    if (isCalculatedScoreCel) {
      cell.value = {
        formula: `IFERROR(SUMPRODUCT(scores_${row},weights,--(types="calificable")),0)`,
        result: cell.value || 0,
      };

      cell.numFmt = '0.00';

      addCustomName({ ws, name: 'avgScores', cell });
    }

    if (isCustomScoreCel) {
      const leftCell = ws.getCell(absoluteRow, absoluteCol - 1);
      if ((leftCell.value.result || 0) === cell.value) {
        cell.value = {
          formula: `ROUND(${leftCell._address},0)`,
          result: Math.round(cell.value),
        };
      }

      cell.numFmt = '0';
      addCustomName({ ws, name: 'customScores', cell });
    }

    cell.border = border;
  };
}
