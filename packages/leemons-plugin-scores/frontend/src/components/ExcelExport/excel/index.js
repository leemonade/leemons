import createWorkbook from './config/createWorkbook';
import createSheet from './content/createSheet';
import writeTable from './content/table/writeTable';
import writeHeader from './content/writeHeader';

export default function generateExcel({ headerShown, tableData, labels, period }) {
  const wb = createWorkbook();
  const notebookSheet = createSheet(wb, 'notebook');
  if (headerShown) {
    writeHeader(notebookSheet, period, labels.period);
  }

  writeTable({
    wb,
    ws: notebookSheet,
    tableData,
    labels: labels.table,
    headerShown,
  });

  return wb;
}
