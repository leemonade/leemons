import { arrayToContent } from '../../helpers';
import { getStyle } from './style';

/**
 *
 * @param {import("exceljs").Worksheet} workSheet
 * @param {*} param1
 * @param {*} labels
 */
export default function writeHeader(
  workSheet,
  initialPosition,
  { period, startDate, endDate, program, subject },
  labels
) {
  const contentArray = [
    ['', ''],
    [labels.period, period],
    [labels.startDate, new Date(startDate)],
    [labels.endDate, new Date(endDate)],
    [labels.program, program],
    [labels.subject, subject],
    ['', ''],
  ];

  const content = arrayToContent({
    ws: workSheet,
    array: contentArray,
    initialPosition,
    getStyle: getStyle(contentArray),
  });

  return content;
}
