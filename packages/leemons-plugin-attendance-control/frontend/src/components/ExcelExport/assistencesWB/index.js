/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import {
  arrayToContent,
  cellToIndexes,
  createSheet,
  createWorkbook,
  indexesToCell,
} from '../helpers';
import getStyle from './table/students/getStyle';

export function generateAssistancesWB({ headerShown, data, labels, sessions }) {
  const wb = createWorkbook();
  const ws = createSheet(wb, 'notebook');

  let initialPosition = 'B2';

  const contentArray = [['', '']];

  if (headerShown) {
    const _row = [labels.students];

    _.forEach(sessions, (session) => {
      _row.push(labels.session.replace('{index}', session.index + 1));
    });

    _row.push(labels.studentAvg);

    contentArray.push(_row);

    const { row, columnIndex } = cellToIndexes(initialPosition);
    initialPosition = indexesToCell(row, columnIndex + 1);
  }

  contentArray.push(['', '']);

  arrayToContent({
    ws,
    array: contentArray,
    initialPosition,
    getStyle: getStyle({ ws }),
  });
  return wb;
}
