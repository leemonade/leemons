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
  { startDate, endDate, program, course, group, period },
  labels
) {
  const contentArray = [
    ['', ''],
    // eslint-disable-next-line eqeqeq
    [labels.startDate, new Date(startDate) == 'Invalid Date' ? '-' : new Date(startDate)],
    // eslint-disable-next-line eqeqeq
    [labels.endDate, new Date(endDate) == 'Invalid Date' ? '-' : new Date(endDate)],
    period && [labels.period, period],
    [labels.program, program],
    [labels.course, course],
    group && [labels.group, group],
    ['', ''],
  ].filter(Boolean);

  const content = arrayToContent({
    ws: workSheet,
    array: contentArray,
    initialPosition,
    getStyle: getStyle(contentArray),
  });

  return content;
}
