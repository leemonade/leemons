/* eslint-disable no-param-reassign */
import { cellToIndexes } from '../cellPositioning';

const global = window;

if (!global.customNames) {
  global.customNames = {};
}

/**
 *
 * @param {{
 * cell: import("exceljs").Cell
 * }} param0
 */
export function addCustomName({ ws, name: _name, cell }) {
  const id = ws._customNamesId;
  const name = `${id}__${_name}`;

  const { columnIndex, row } = cellToIndexes(cell.address);
  if (!global.customNames[name]) {
    global.customNames[name] = [
      {
        address: cell.address,
        row,
        column: columnIndex,
      },
    ];
  } else {
    global.customNames[name].push({
      address: cell.address,
      row,
      column: columnIndex,
    });
  }

  const actualNames = cell.names;

  if (!actualNames?.length) {
    cell.names = [_name];
  } else {
    cell.names = [...actualNames, _name];
  }
}

export function getCustomName({ ws, name: _name }) {
  const id = ws._customNamesId;
  const name = `${id}__${_name}`;

  return global.customNames[name];
}

export function getCustomNamesRange({ ws, name: _name, colFixed, rowFixed } = {}) {
  const id = ws._customNamesId;
  const name = `${id}__${_name}`;

  const cells = global.customNames[name];

  if (!cells) {
    return null;
  }

  // EN: In this case, we can assume the first cell added is the top-left and the last is the bottom-right
  // ES: En este caso, podemos asumir que la primera celda agregada es la superior izquierda y la última es la inferior derecha
  const firstCell = cellToIndexes(cells[0].address);
  const lastCell = cellToIndexes(cells[cells.length - 1].address);

  return `${colFixed ? '$' : ''}${firstCell.column}${rowFixed ? '$' : ''}${firstCell.row}:${
    colFixed ? '$' : ''
  }${lastCell.column}${rowFixed ? '$' : ''}${lastCell.row}`;
}
