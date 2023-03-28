/* eslint-disable import/prefer-default-export */
import { getSessionDateString } from '@attendance-control/helpers/getSessionDateString';
import getUserFullName from '@users/helpers/getUserFullName';
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

  const contentArray = [];

  if (headerShown) {
    contentArray.push(['', '']);
    const _row = [''];
    const _row2 = [labels.students];

    _.forEach(sessions, (session) => {
      _row.push(`${labels.session.replace('{index}', session.index + 1)}`);
      _row.push(`${labels.session.replace('{index}', session.index + 1)} - Comment`);
      _row2.push(`${getSessionDateString(session)}`);
      _row2.push('');
    });

    _row2.push(labels.studentAvg);

    contentArray.push(_row);
    contentArray.push(_row2);

    const { row, columnIndex } = cellToIndexes(initialPosition);
    initialPosition = indexesToCell(row, columnIndex + 1);
  }

  _.forEach(data, (item) => {
    const row = [getUserFullName(item.student)];
    _.forEach(sessions, (session) => {
      const { comment, assistance } = item[new Date(session.start).getTime().toString()];
      row.push(assistance || '-');
      row.push(comment || '-');
    });
    row.push(`${item.avg.avg}%`);
    contentArray.push(row);
  });

  if (headerShown) {
    contentArray.push(['', '']);
  }

  arrayToContent({
    ws,
    array: contentArray,
    initialPosition,
    getStyle: getStyle({ ws }),
  });
  return wb;
}
