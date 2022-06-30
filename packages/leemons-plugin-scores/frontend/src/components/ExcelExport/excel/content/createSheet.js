import { Workbook } from 'exceljs';

/**
 *
 * @param {Workbook} wb
 * @param {string} title
 */
export default function createSheet(wb, title) {
  return wb.addWorksheet(title, {
    views: [
      {
        showGridLines: false,
      },
    ],
  });
}
