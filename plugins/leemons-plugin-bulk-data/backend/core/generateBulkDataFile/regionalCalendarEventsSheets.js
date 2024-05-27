const { REGIONAL_CALENDAR_EVENT_TYPE } = require('./config/constants');
const { styleCell } = require('./helpers');

const addEventsToWorksheet = ({
  worksheet,
  events,
  type,
  creator,
  regionalCalendarBulkId,
  center,
  dateCounter,
}) => {
  let count = dateCounter;
  events.forEach((event) => {
    count++;
    const bulkId = `date${count.toString().padStart(2, '0')}`;
    const calendarObject = {
      root: bulkId,
      name: event.name,
      center,
      regionalCalendar: regionalCalendarBulkId,
      type,
      creator,
      startDate: event.startDate,
      endDate: event.endDate,
    };
    worksheet.addRow(calendarObject);
  });
  return count;
};

function createRegionalCalendarEventsSheet({ workbook, regionalCalendars }) {
  const worksheet = workbook.addWorksheet('ac_reg_events');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'name', key: 'name', width: 20 },
    { header: 'center', key: 'center', width: 20 },
    { header: 'regionalCalendar', key: 'regionalCalendar', width: 20 },
    { header: 'type', key: 'type', width: 15 },
    { header: 'startDate', key: 'startDate', width: 15 },
    { header: 'endDate', key: 'endDate', width: 15 },
    { header: 'creator', key: 'creator', width: 10 },
  ];

  worksheet.addRow({
    root: 'BulkId',
    name: 'Name',
    center: 'Center',
    regionalCalendar: 'Regional Calendar',
    type: 'Type',
    startDate: 'Start Date',
    endDate: 'End Date',
    creator: 'Creator',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  let dateCounter = 0;
  return regionalCalendars.forEach((regCalendar) => {
    const { center, creator, bulkId: regionalCalendarBulkId } = regCalendar;

    dateCounter = addEventsToWorksheet({
      worksheet,
      events: regCalendar.regionalEvents,
      type: REGIONAL_CALENDAR_EVENT_TYPE.REGIONAL,
      creator,
      regionalCalendarBulkId,
      center,
      dateCounter,
    });

    dateCounter = addEventsToWorksheet({
      worksheet,
      events: regCalendar.localEvents,
      type: REGIONAL_CALENDAR_EVENT_TYPE.LOCAL,
      creator,
      regionalCalendarBulkId,
      center,
      dateCounter,
    });

    dateCounter = addEventsToWorksheet({
      worksheet,
      events: regCalendar.daysOffEvents,
      type: REGIONAL_CALENDAR_EVENT_TYPE.DAY_OFF,
      creator,
      regionalCalendarBulkId,
      center,
      dateCounter,
    });
  });
}

module.exports = { createRegionalCalendarEventsSheet };
