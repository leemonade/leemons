/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';

import { listSessionClassesRequest } from '@academic-portfolio/request';
import {
  Box,
  Stack,
  Title,
  Button,
  Loader,
  createStyles,
  Kanban as BubblesKanban,
} from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/solid';
import { useStore } from '@common';
import useWelcome from '@dashboard/request/hooks/queries/useWelcome';
import tKeys from '@multilanguage/helpers/tKeys';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getCentersWithToken } from '@users/session';
import hooks from 'leemons-hooks';
import _, { forEach, keyBy, map } from 'lodash';
import PropTypes from 'prop-types';

import useTransformEvent from '../../helpers/useTransformEvent';
import {
  getCalendarsToFrontendRequest,
  listKanbanColumnsRequest,
  listKanbanEventOrdersRequest,
  saveKanbanEventOrdersRequest,
  updateEventRequest,
} from '../../request';

import { KanbanTaskCard } from '@calendar/components';
import { useCalendarEventModal } from '@calendar/components/calendar-event-modal';
import getCalendarNameWithConfigAndSession from '@calendar/helpers/getCalendarNameWithConfigAndSession';
import prefixPN from '@calendar/helpers/prefixPN';

const useStyles = createStyles((theme, { inTab }) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[4],
  },
  calendarContainer: {
    overflowY: 'auto',
    height: inTab ? 'calc(100vh - 230px)' : 'auto',
    maxHeight: inTab ? 'calc(100vh - 230px)' : '600px',
  },
}));

function UserProgramKanban({ program, classe, session, inTab, useAllColumns = false }) {
  const { classes } = useStyles({ inTab });
  const [transformEv, evLoading] = useTransformEvent();
  const [store, render] = useStore({
    loading: true,
    filtersData: {
      calendars: [],
    },
    filters: {
      calendars: [],
    },
  });
  const [t] = useTranslateLoader(prefixPN('userProgramKanban'));
  const prefixCard = prefixPN('kanbanTaskCard');
  const [, translationsCard] = useTranslateLoader(prefixCard);
  const [toggleEventModal, EventModal, { openModal: openEventModal }] = useCalendarEventModal();

  const { data: welcomeCompleted } = useWelcome();
  const hasEvents = store.board?.columns?.some((column) => column.cards?.length);

  const filterMessagesCard = React.useMemo(() => {
    if (translationsCard && translationsCard.items) {
      return _.reduce(
        translationsCard.items,
        (acc, value, key) => {
          acc[key.replace(`${prefixCard}.`, '')] = value;
          return acc;
        },
        {}
      );
    }
    return {};
  }, [translationsCard]);

  // ······························································
  // METHODS

  async function getKanbanColumns() {
    const { columns } = await listKanbanColumnsRequest();
    const orderedColumns = _.orderBy(columns, ['order'], ['asc']);
    return _.filter(orderedColumns, (column) => [2, 3, 4, 5].includes(column.order));
  }

  async function getTranslationColumns() {
    const keys = _.map(store.columns, 'nameKey');
    const { items } = await getLocalizationsByArrayOfItems(keys);
    return items;
  }

  async function getKanbanColumnsEventsOrder() {
    const { orders } = await listKanbanEventOrdersRequest(store.center.token);
    const obj = {};
    _.forEach(orders, (order) => {
      obj[order.column] = order.events;
    });
    return obj;
  }

  async function getCalendarsForCenter() {
    const { status, ...response } = await getCalendarsToFrontendRequest(store.center.token);

    return {
      ...response,
      calendars: _.map(response.calendars, (calendar) => ({
        ...calendar,
        name: getCalendarNameWithConfigAndSession(calendar, response, session),
      })),
    };
  }

  function getColumnName(name) {
    return tKeys(name, store.columnsT);
  }

  function getKanbanBoard() {
    const cols = [];
    const eventsByColumn = _.groupBy(store.data.events, 'data.column');
    _.forEach(store.columns, (column) => {
      let cards = [];
      if (eventsByColumn[column.id] && store.columnsEventsOrders[column.id]) {
        const cardsNoOrdered = [];
        _.forEach(eventsByColumn[column.id], (event) => {
          const index = store.columnsEventsOrders[column.id].indexOf(event.id);
          if (index >= 0) {
            cards[index] = event;
          } else {
            cardsNoOrdered.push(event);
          }
        });
        cards = _.map(cardsNoOrdered, (c) => ({ ...c, notOrdered: true })).concat(cards);
      } else {
        cards = eventsByColumn[column.id] || [];
      }

      cards = _.filter(cards, (c) => !!c);

      if (store.filters.calendars.length) {
        cards = _.filter(cards, (c) => {
          let show = false;
          // eslint-disable-next-line consistent-return
          _.forEach(c.data.classes, (calendar) => {
            if (store.filters.calendars.indexOf(calendar) >= 0) {
              show = true;
              return false;
            }
          });
          return show;
        });
      }

      const calendarIds = map(store.data.onlyProgramCalendars, 'id');
      cards = _.filter(cards, (c) => {
        let toReturn = false;
        if (c.type === 'calendar.task' && c.data && c.data.classes) {
          // eslint-disable-next-line consistent-return
          forEach(c.data.classes, (calendar) => {
            if (calendarIds.includes(calendar)) {
              toReturn = true;
              return false;
            }
          });
        }
        return toReturn;
      });

      cols.push({
        id: column.id,
        title: getColumnName(column.nameKey),
        cards: _.map(cards, (card) => transformEv(card, store.data.calendars)),
      });
    });
    return { columns: cols };
  }

  // ······························································
  // INIT DATA PROCESSING

  async function load() {
    store.currentLoaded = JSON.stringify({ program, classe });
    store.centers = getCentersWithToken();
    if (store.centers) {
      [store.center] = store.centers;
      store.columns = await getKanbanColumns();
      store.columnsT = await getTranslationColumns();
      store.columnsEventsOrders = await getKanbanColumnsEventsOrder();
      const promises = [getCalendarsForCenter()];
      if (program) {
        promises.push(listSessionClassesRequest({ program: program.id }));
      }
      const [centerData, programData] = await Promise.all(promises);
      store.data = centerData;
      if (program) {
        store.classesById = keyBy(programData.classes, 'id');
      }
      if (classe) {
        store.classesById = {
          [classe.id]: classe,
        };
      }
      store.data.onlyProgramCalendars = _.filter(store.data.calendars, (calendar) => {
        const keySplit = calendar.key.split('.');
        const classId = keySplit[keySplit.length - 1];
        return !!store.classesById[classId];
      });
      store.filtersData.calendars = _.map(store.data.onlyProgramCalendars, (calendar) => ({
        label: calendar.name,
        value: calendar.id,
      }));
      store.board = getKanbanBoard();
    }

    store.loading = false;
    render();
  }

  React.useEffect(() => {
    const toLoad = JSON.stringify({ program, classe });
    if (
      (program || classe) &&
      !evLoading &&
      (!store.currentLoaded || toLoad !== store.currentLoaded)
    )
      load();
  }, [program, classe, evLoading]);

  // ······························································
  // HANDLERS

  const onNewEvent = () => {
    store.selectedEvent = null;
    openEventModal();
  };

  function onChange(values, event) {
    const cardsById = {};
    _.forEach(values.columns, (column) => {
      _.forEach(column.cards, (card) => {
        cardsById[card.id] = { ...card, data: { ...card.data, column: column.id } };
      });
    });
    const changedColumns = [];
    if (
      event.destination &&
      event.source &&
      event.destination.droppableId === event.source.droppableId
    ) {
      changedColumns.push(event.destination.droppableId);
    }
    _.forEach(store.data.events, (ev) => {
      const card = cardsById[ev.id];
      if (ev.data && ev.data.column && card && ev.data.column !== card.data.column) {
        changedColumns.push(card.data.column);
        // eslint-disable-next-line no-param-reassign
        ev.data.column = card.data.column;
        updateEventRequest(store.center.token, ev.id, { data: ev.data });
        hooks.fireEvent('calendar:kanban:reorded', { id: ev.id, column: ev.data.column });
      }
    });

    _.forEach(values.columns, (column) => {
      if (changedColumns.indexOf(column.id) >= 0) {
        store.columnsEventsOrders[column.id] = _.map(column.cards, 'id');
        saveKanbanEventOrdersRequest(
          store.center.token,
          column.id,
          store.columnsEventsOrders[column.id]
        );
      }
    });

    store.board = getKanbanBoard();

    render();
  }

  function onClickCard({ bgColor, icon, borderColor, ...e }) {
    store.selectedEvent = e;
    openEventModal();
    render();
  }

  useEffect(() => {
    hooks.addAction('calendar:force:reload', load);
    return () => {
      hooks.removeAction('calendar:force:reload', load);
    };
  });

  // ······························································
  // RENDER

  if (!welcomeCompleted && !hasEvents) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <Stack fullWidth alignItems="end" justifyContent="space-between">
        <Box>
          <Title order={3}>{t(inTab ? 'kanban' : 'kanbanHighlight')}</Title>
        </Box>
        <Box>
          {!store.loading ? (
            <Button variant="link" leftIcon={<AddCircleIcon />} onClick={onNewEvent}>
              {t('newTask')}
            </Button>
          ) : null}
        </Box>
      </Stack>

      {!store.loading ? (
        <Box className={classes.calendarContainer}>
          <EventModal
            centerToken={store.centers[0].token}
            event={store.selectedEvent}
            close={toggleEventModal}
            classCalendars={store.filtersData.calendars}
            forceType={'calendar.task'}
          />
          <BubblesKanban
            value={store.board}
            clean
            onChange={onChange}
            disableCardDrag={false}
            showNewOnFirstColumn
            newItemLabel={t('addNewTask')}
            onNew={onNewEvent}
            itemRender={(props) => (
              <KanbanTaskCard
                {...props}
                labels={filterMessagesCard}
                config={store.data}
                onClick={onClickCard}
              />
            )}
          />
        </Box>
      ) : (
        <Loader />
      )}
    </Box>
  );
}

UserProgramKanban.propTypes = {
  program: PropTypes.object,
  classe: PropTypes.object,
  session: PropTypes.object,
  useAllColumns: PropTypes.bool,
  inTab: PropTypes.bool,
};

export default UserProgramKanban;
