import { Workbook } from 'exceljs';
import { v4 as uuidv4 } from 'uuid';

/**
 *
 * @param {Workbook} wb
 * @param {string} title
 */
export default function createSheet(wb, title) {
  const ws = wb.addWorksheet(title, {
    views: [
      {
        showGridLines: false,
      },
    ],
  });

  ws._customNamesId = uuidv4();

  return ws;
}
