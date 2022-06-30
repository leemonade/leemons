/* eslint-disable no-param-reassign */
import arrayToContent from './arrayToContent';

/**
 *
 * @param {import("exceljs").Worksheet} workSheet
 * @param {*} param1
 * @param {*} labels
 */
export default function writeHeader(
  workSheet,
  { period, startDate, endDate, program, subject },
  labels
) {
  const contentArray = [
    ['', ''],
    [labels.period, period],
    [labels.startDate, startDate],
    [labels.endDate, endDate],
    [labels.program, program],
    [labels.subject, subject],
    ['', ''],
  ];

  const getStyle = (cell, { relCol: col, relRow: row }) => {
    const border = {};
    if (row === 0) {
      border.top = { style: 'medium' };
    }

    if (row === contentArray.length - 1) {
      border.bottom = { style: 'medium' };
    }

    if (col === 0) {
      border.left = { style: 'medium' };
    }

    if (col === contentArray[row].length - 1) {
      border.right = { style: 'medium' };
    }

    cell.border = border;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: col === 0 ? 'EFEFEF' : 'FFFFFF' },
    };
  };
  const content = arrayToContent({
    ws: workSheet,
    array: contentArray,
    initialPosition: 'B2',
    getStyle,
  });

  return content;
}
