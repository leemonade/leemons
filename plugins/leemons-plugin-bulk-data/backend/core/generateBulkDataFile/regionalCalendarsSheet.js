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
  ];

  worksheet.addRow({
    root: 'BulkId',
    name: 'Name',
    center: 'Center',
    creator: 'Creator',
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

  return regionalCalendars.map((rg, i) => {
    const bulkId = `reg_cal${(i + 1).toString().padStart(2, '0')}`;
    const calendarObject = {
      root: bulkId,
      name: rg.name,
      center: centers.find((item) => item.id === rg.center).bulkId,
      creator: ADMIN_BULK_ID,
    };
    worksheet.addRow(calendarObject);
    return {
      ...rg,
      center: calendarObject.center,
      creator: calendarObject.creator,
      bulkId,
    };
  });
}

module.exports = { createRegionalCalendarsSheet };
