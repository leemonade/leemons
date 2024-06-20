const { styleCell } = require('../helpers');

async function createProgramCalendarsSheet({ workbook, programs, regionalCalendars, ctx }) {
  const worksheet = workbook.addWorksheet('ac_program_calendars');
  worksheet.columns = [
    { header: 'root', key: 'root', width: 10 },
    { header: 'program', key: 'program', width: 20 },
    { header: 'regionalConfig', key: 'regionalConfig', width: 20 },
  ];

  worksheet.addRow({
    root: 'BulkId',
    program: 'Program',
    regionalConfig: 'Regional Calendar',
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
      regionalConfig: regionalCalendars.find((item) => item.id === config.regionalConfig.id)
        ?.bulkId,
    };
    worksheet.addRow(calendarObject);
    return {
      ...config,
      program,
      bulkId,
    };
  });
}

module.exports = { createProgramCalendarsSheet };
