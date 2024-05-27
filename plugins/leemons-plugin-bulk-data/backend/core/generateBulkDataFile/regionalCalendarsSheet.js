const { flatten } = require('lodash');
const { ADMIN_BULK_ID } = require('./config/constants');
const { styleCell } = require('./helpers');

async function createRegionalCalendarsSheet({ workbook, centers, ctx }) {
  const worksheet = workbook.addWorksheet('ac_regional_calendars');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'name', key: 'name', width: 20 },
    { header: 'center', key: 'center', width: 20 },
    { header: 'creator', key: 'creator', width: 10 },
    { header: 'regionalEventsRel', key: 'regionalEventsRel', width: 10 },
  ];

  worksheet.addRow({
    root: 'BulkId',
    name: 'Name',
    center: 'Center',
    creator: 'Creator',
    regionalEventsRel: 'Use regional dates of...',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const regionalCalendarPromises = [];
  centers.forEach((center) => {
    regionalCalendarPromises.push(
      ctx
        .call('academic-calendar.regionalConfig.listRest', { center: center.id })
        .then((result) => result.regionalConfigs)
    );
  });
  const regionalCalendars = flatten(await Promise.all(regionalCalendarPromises));

  const mapWithBulkIds = regionalCalendars.map((item, i) => {
    const bulkId = `reg_cal${(i + 1).toString().padStart(2, '0')}`;

    return {
      ...item,
      bulkId,
    };
  });

  return mapWithBulkIds.map((rg) => {
    const finalObject = {
      ...rg,
      center: centers.find((center) => center.id === rg.center).bulkId,
      creator: ADMIN_BULK_ID,
      regionalEventsRel: mapWithBulkIds.find((_rg) => _rg.id === rg.regionalEventsRel)?.bulkId,
    };
    worksheet.addRow({ root: rg.bulkId, ...finalObject });

    return finalObject;
  });
}

module.exports = { createRegionalCalendarsSheet };
