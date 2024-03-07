import { addCustomName, indexesToCell } from '../../../helpers';

/* eslint-disable no-param-reassign */
export default function getStyle({ tableData, ws }) {
  const periodsLength = tableData.classes.map((c) => c.periods.length);
  const scoresColLength = periodsLength.reduce((sum, n) => sum + n);

  let index = 0;
  let subjectIndex = 0;
  let indexesForRow = 0;
  return (cell, { relRow: row, relCol: col, row: absoluteRow, col: absoluteCol }) => {
    const border = {};

    const headersHeight = 4;
    const studentDataLength = 2;

    const isFirstRow = row === 0;
    const isFirstScoreRow = row === 1;

    const isLastStudentDataCol = col === studentDataLength - 1;
    const isStudentDataCol = col < studentDataLength;

    const isScoreCol = !isStudentDataCol && col < scoresColLength + studentDataLength;

    const isCalculatedScoreCel = col === scoresColLength + studentDataLength;
    const isCustomScoreCel = col === scoresColLength + studentDataLength + 1;

    if (row !== indexesForRow) {
      index = 0;
      subjectIndex = 0;
      indexesForRow = row;
    }

    if (isScoreCol) {
      index++;
    }

    const isLastCurrentSubjectCol = index === periodsLength[subjectIndex];

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
    if (isLastCurrentSubjectCol) {
      if (cell.value?.isCustom) {
        cell.value = cell.value.value;
      } else {
        const range = `${indexesToCell(absoluteRow, absoluteCol - index + 1)}:${indexesToCell(
          absoluteRow,
          absoluteCol - 1
        )}`;

        cell.value = {
          formula: `IFERROR(AVERAGE(${range}),0)`,
          result: cell.value.value,
        };
      }
    }

    if (isScoreCol) {
      if (isFirstRow) {
        const upperCell = ws.getCell(absoluteRow - 1, absoluteCol);
        addCustomName({ ws, name: 'scores', cell: upperCell });
      }

      cell.numFmt = '0.00';

      addCustomName({ ws, name: 'scores', cell });
      addCustomName({ ws, name: `scores_${row}`, cell });
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
        formula: `SUMPRODUCT(scores_${row},--(types="final"))/SUMPRODUCT(--(types="final"))`,
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
          result: cell.value,
        };
      }

      addCustomName({ ws, name: 'customScores', cell });
    }

    if (isLastCurrentSubjectCol && isFirstScoreRow) {
      const subjectRow = absoluteRow - row - headersHeight + 2;
      ws.mergeCells(
        `${indexesToCell(subjectRow, absoluteCol - index + 1)}:${indexesToCell(
          subjectRow,
          absoluteCol
        )}`
      );
    }

    if (isLastCurrentSubjectCol) {
      index = 0;
      subjectIndex++;

      border.right = {
        style: 'medium',
        color: {
          argb: '000000',
        },
      };

      if (isFirstScoreRow) {
        for (let i = 0; i < headersHeight + 1; i++) {
          const c = ws.getCell(absoluteRow - i, absoluteCol);
          c.border = {
            ...c.border,
            right: border.right,
          };
        }
      }
    }

    cell.border = border;
  };
}
