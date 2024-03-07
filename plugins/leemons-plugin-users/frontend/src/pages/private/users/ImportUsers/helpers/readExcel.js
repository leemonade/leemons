/* eslint-disable no-param-reassign */
import { Workbook } from 'exceljs';

function fileToBuffer(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const readFile = function () {
      resolve(reader.result);
    };

    reader.addEventListener('load', readFile);
    reader.readAsArrayBuffer(file);
  });
}

export async function readExcel(file) {
  const wb = new Workbook();
  await wb.xlsx.load(await fileToBuffer(file));
  if (wb.worksheets.length < 1) throw new Error('No work sheet detected');
  const ws = wb.worksheets[0];
  const result = [];
  for (let r = 0; r < ws.rowCount; r++) {
    const item = [];
    for (let c = 0; c < ws.columnCount; c++) {
      item.push(ws.getCell(r + 1, c + 1).value);
    }
    result.push(item);
  }
  return result;
}

export default readExcel;
