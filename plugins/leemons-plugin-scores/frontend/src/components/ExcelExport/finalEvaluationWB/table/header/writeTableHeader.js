import { map } from 'lodash';
import { arrayToContent } from '../../../helpers';
import addConditionalFormatting from './addConditionalFormatting';
import { getStyle } from './getStyle';

function parsePeriods({ classes }) {
  return classes.flatMap((klass) =>
    klass.periods.map((period) => ({
      type: period.id === 'final' ? 'final' : 'partial',
      subject: klass.name + (klass.group && klass.group !== '-auto-' ? ` - ${klass.group}` : ''),
      evaluation: period.name,
    }))
  );
}

/**
 *
 * @param {{
 * ws: import("exceljs").Worksheet
 * }} param0
 */
export default function writeHeader({ ws, tableData, labels, initialPosition }) {
  const parsedPeriods = parsePeriods({ ...tableData, labels });

  const contentArray = [
    [labels.type, ...map(parsedPeriods, 'type'), '', ''],
    [labels.subject, ...map(parsedPeriods, 'subject'), '', ''],
    [
      labels.evaluation,
      ...map(parsedPeriods, 'evaluation'),
      labels.avg.toLocaleUpperCase(),
      labels.custom.toLocaleUpperCase(),
    ],
  ];

  arrayToContent({
    ws,
    array: contentArray,
    initialPosition,
    getStyle: getStyle({ ws, contentArray }),
  });

  addConditionalFormatting({ ws });
}
