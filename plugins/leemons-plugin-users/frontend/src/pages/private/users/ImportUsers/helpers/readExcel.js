/* eslint-disable no-param-reassign */
import { Workbook } from 'exceljs';
import { compact } from 'lodash';

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
  const wsProfileDataset = wb.worksheets[1];

  const users = [];
  const dataset = [];

  for (let r = 0; r < ws.rowCount; r++) {
    const item = [];
    for (let c = 0; c < ws.columnCount; c++) {
      item.push(ws.getCell(r + 1, c + 1).value);
    }
    if (compact(item).length === 0) break;
    users.push(item);
  }

  if (wsProfileDataset) {
    for (let r = 0; r < wsProfileDataset.rowCount; r++) {
      const item = [];
      for (let c = 0; c < wsProfileDataset.columnCount; c++) {
        item.push(wsProfileDataset.getCell(r + 1, c + 1).value);
      }
      dataset.push(item);
    }
  }

  return { users, dataset };
}

export default readExcel;
