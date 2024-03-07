import { cellToIndexes, indexesToCell } from '../../helpers';
import { writeTableHeader } from './header';
import { writeStudents } from './students';

/**
 *
 * @param {import("exceljs").Worksheet} ws
 * @param {*} tableData
 * @param {*} labels
 */
export default function writeTable({ ws, tableData, labels, initialPosition }) {
  const { row, columnIndex } = cellToIndexes(initialPosition);

  const headerInitialPosition = indexesToCell(row, columnIndex + 1);
  const studentsInitialPosition = indexesToCell(row + 3, columnIndex);

  writeTableHeader({
    ws,
    tableData,
    labels,
    initialPosition: headerInitialPosition,
  });

  writeStudents({
    ws,
    tableData,
    labels,
    initialPosition: studentsInitialPosition,
  });
}
