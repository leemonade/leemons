import writeHeader from './writeHeader';
import writeStudentsWithActivities from './writeStudentsWithActivities';

/**
 *
 * @param {import("exceljs").Worksheet} ws
 * @param {*} tableData
 * @param {*} labels
 */
export default function writeTable({ wb, ws, tableData, labels, headerShown }) {
  writeHeader({
    wb,
    ws,
    activities: tableData.activities,
    labels,
    initialPosition: headerShown ? 'G7' : 'D1',
  });
  writeStudentsWithActivities({
    ws,
    tableData,
    labels,
    initialPosition: headerShown ? 'D12' : 'A6',
  });

  // eslint-disable-next-line no-param-reassign
  ws.getColumn('E').width = 15 / 7;
}
