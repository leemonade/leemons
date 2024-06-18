const { omit } = require('lodash');
const importProgramCalendars = require('./bulk/academic-calendar/programCalendars');
const importRegionalCalendars = require('./bulk/academic-calendar/regionalCalendars');

async function initAcademicCalendar({ file, config, ctx }) {
  const regionalCalendars = await importRegionalCalendars(file, config.centers);
  const regCalendarsKeys = Object.keys(regionalCalendars);

  const promises = regCalendarsKeys.map((key) => {
    const { creator, regionalEventsRel, ...regCalendar } = regionalCalendars[key];
    return ctx
      .call(
        'academic-calendar.regionalConfig.saveRest',
        {
          ...regCalendar,
        },
        { meta: { userSession: { ...config.users[creator] } } }
      )
      .then(({ regionalConfig }) => {
        regionalCalendars[key] = { ...regionalConfig, creator, regionalEventsRel };
      });
  });

  await Promise.all(promises);

  const updatePromises = [];
  Object.values(regionalCalendars).forEach(
    ({
      id,
      name,
      center,
      regionalEventsRel,
      localEvents,
      regionalEvents,
      daysOffEvents,
      creator,
    }) => {
      if (regionalEventsRel) {
        updatePromises.push(
          ctx.call(
            'academic-calendar.regionalConfig.saveRest',
            {
              id,
              name,
              center,
              localEvents: JSON.parse(localEvents),
              regionalEvents: JSON.parse(regionalEvents),
              daysOffEvents: JSON.parse(daysOffEvents),
              regionalEventsRel: regionalCalendars[regionalEventsRel]?.id,
            },
            { meta: { userSession: { ...config.users[creator] } } }
          )
        );
      }
    }
  );
  await Promise.all(updatePromises);

  return regCalendarsKeys.reduce((acc, key) => {
    acc[key] = {
      ...omit(regionalCalendars[key], ['creator']),
      regionalEventsRel: regionalCalendars[key].regionalEventsRel?.id,
    };
    return acc;
  }, {});
}

async function initProgramCalendars({ file, config, ctx }) {
  const programCalendars = await importProgramCalendars(file, config);
  const programCalendarsKeys = Object.keys(programCalendars);

  const promises = [];
  programCalendarsKeys.forEach((key) => {
    const { creator, ...programCalendar } = programCalendars[key];
    promises.push(ctx.call('academic-calendar.config.saveRest', { ...programCalendar }));
  });

  await Promise.all(promises);
}

module.exports = { initAcademicCalendar, initProgramCalendars };
