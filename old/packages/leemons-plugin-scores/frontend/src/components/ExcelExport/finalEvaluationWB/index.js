import { cellToIndexes, createSheet, createWorkbook, indexesToCell } from '../helpers';
import writeHeader from './header/writeHeader';
import writeTable from './table/writeTable';

export default function generateFinalEvaluationWB({ headerShown, filters, tableData, labels }) {
  const wb = createWorkbook();
  const ws = createSheet(wb, 'notebook');

  let renderPosition = 'B2';

  if (headerShown) {
    const { lastPosition } = writeHeader(ws, renderPosition, filters, labels.period);

    const { row, columnIndex } = cellToIndexes(lastPosition);
    renderPosition = indexesToCell(row, columnIndex + 1);
  }

  writeTable({
    ws,
    tableData,
    labels: labels.table,
    initialPosition: renderPosition,
  });

  return wb;
}
