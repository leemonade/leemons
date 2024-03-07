import { createWorkbook, createSheet, cellToIndexes, indexesToCell } from '../helpers';
import { writeHeader } from './header';
import { writeTable } from './table';

export default function generateEvaluationWB({ headerShown, tableData, labels, period, types }) {
  const wb = createWorkbook();
  const ws = createSheet(wb, 'notebook');

  let renderPosition = 'B2';

  if (headerShown) {
    const { lastPosition } = writeHeader(ws, renderPosition, period, labels.period);

    const { row, columnIndex } = cellToIndexes(lastPosition);
    renderPosition = indexesToCell(row, columnIndex + 1);
  }

  writeTable({
    wb,
    ws,
    tableData,
    labels: labels.table,
    types,
    initialPosition: renderPosition,
  });

  return wb;
}
