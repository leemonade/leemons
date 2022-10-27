import { cellToIndexes } from '../cellPositioning';

/**
 *
 * @param {import("exceljs").Worksheet} ws
 * @param {*} array
 * @param {*} initialPosition
 */
export default function arrayToContent({ ws, array, initialPosition, getStyle }) {
  const { columnIndex, row } = cellToIndexes(initialPosition);

  const rowLength = array.length;
  const columnLength = array[rowLength - 1].length;

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      const cell = ws.getCell(row + i, columnIndex + j);
      cell.value = array[i][j];

      if (typeof getStyle === 'function') {
        getStyle(cell, {
          col: columnIndex + j,
          row: row + i,
          relCol: j,
          relRow: i,
        });
      }
    }
  }

  const lastCell = ws.getCell(row + rowLength - 1, columnIndex + columnLength - 1);

  return {
    initialPosition,
    lastPosition: lastCell._address,
  };
}
