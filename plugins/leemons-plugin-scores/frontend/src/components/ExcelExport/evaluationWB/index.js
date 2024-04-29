import getCourseName from '@academic-portfolio/helpers/getCourseName';
import { createWorkbook, createSheet, cellToIndexes, indexesToCell } from '../helpers';
import { writeHeader } from './header';
import { writeTable } from './table';

function generateEvaluationWS({ sheetName, headerShown, tableData, labels, period, types, wb }) {
  const ws = createSheet(wb, sheetName);

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
}

function getWSName(klass, index) {
  if (!klass?.subject) {
    return index ? `Notebook (${index})` : 'Notebook';
  }

  let name = `${klass.subject.name} - ${getCourseName(klass.courses)} ${
    klass.groups?.abbreviation ?? ''
  }`.substring(0, 31);

  if (index) {
    name = `(${index}) ${name}`;
  }

  return name;
}

export default function generateEvaluationWB(data) {
  const wb = createWorkbook();

  const dataArray = Array.isArray(data) ? data : [data];

  const nameIsPicked = {};

  dataArray.forEach((dataItem, index) => {
    const { headerShown, tableData, labels, period, types } = dataItem;

    let name = getWSName(tableData?.class);

    if (nameIsPicked[name]) {
      name = getWSName(tableData?.class, index);
    }

    nameIsPicked[name] = true;

    generateEvaluationWS({
      sheetName: name,
      headerShown,
      tableData,
      labels,
      period,
      types,
      wb,
    });
  });

  return wb;
}
