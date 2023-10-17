import { createSheet, createWorkbook } from '../workbook';

export default function indexesToCell(row, column) {
  const wb = createWorkbook('', '');
  const ws = createSheet(wb, '');

  return ws.getCell(row, column)._address;
}
