const { ADMIN_BULK_ID } = require('../config/constants');
const { styleCell } = require('../helpers');

async function createProgramCalendarsSheet({ workbook, programs, ctx }) {
  const worksheet = workbook.addWorksheet('ac_program_calendars');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'program', key: 'program', width: 20 },
    { header: 'creator', key: 'creator', width: 10 },
  ];

  worksheet.addRow({
    root: 'BulkId',
    program: 'Program',
    creator: 'Creator',
  });
  worksheet.getRow(2).eachCell((cell, colNumber) => {
    if (colNumber === 1) {
      styleCell({ cell, fontColor: 'white', bgColor: 'black' });
    } else {
      styleCell({ cell, fontColor: 'black', bgColor: 'lightBlue' });
    }
  });

  const programCalendarConfigurations = (
    await Promise.all(
      programs.map((program) =>
        ctx.call('academic-calendar.config.getConfig', { program: program.id })
      )
    )
  ).filter((config) => config !== null && config !== undefined);

  return programCalendarConfigurations.map((config, i) => {
    const program = programs.find((item) => item.id === config.program);
    const bulkId = `prog_cal${(i + 1).toString().padStart(2, '0')}`;
    const calendarObject = {
      root: bulkId,
      program: program.bulkId,
      creator: ADMIN_BULK_ID,
    };
    worksheet.addRow(calendarObject);
    return {
      ...config,
      program,
      creator: calendarObject.creator,
      bulkId,
    };
  });
}

module.exports = { createProgramCalendarsSheet };
