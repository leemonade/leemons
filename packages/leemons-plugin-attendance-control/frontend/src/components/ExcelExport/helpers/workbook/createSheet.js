import { Workbook } from 'exceljs';
import { uuidv4 } from '@bubbles-ui/leemons';

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
