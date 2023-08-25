import { Workbook } from 'exceljs';
// TODO: install in this plugin uuid library maybe?
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
