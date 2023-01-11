/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  createStyles,
  IconButton,
  Kanban as BubblesKanban,
  Loader,
  Stack,
  Text,
} from '@bubbles-ui/components';
import { saveKanbanEventOrdersRequest, updateEventRequest } from '@calendar/request';
import { AddIcon as PlusIcon, PluginKanbanIcon } from '@bubbles-ui/icons/outline';
import { KanbanTaskCard } from '@bubbles-ui/leemons';
import { useStore } from '@common';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getCentersWithToken } from '@users/session';
import * as _ from 'lodash';
import { forEach, keyBy, map } from 'lodash';
import tKeys from '@multilanguage/helpers/tKeys';
import { useHistory } from 'react-router-dom';
import { useCalendarEventModal } from '@calendar/components/calendar-event-modal';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import getCalendarNameWithConfigAndSession from '@calendar/helpers/getCalendarNameWithConfigAndSession';
import { listSessionClassesRequest } from '@academic-portfolio/request';
import hooks from 'leemons-hooks';
import {
  getCalendarsToFrontendRequest,
  listKanbanColumnsRequest,
  listKanbanEventOrdersRequest,
} from '../../request';
import useTransformEvent from '../../helpers/useTransformEvent';

const Styles = createStyles((theme, { inTab }) => ({
  root: {
    paddingTop: inTab ? 0 : theme.spacing[11],
    width: '100%',
  },
  title: {
    paddingLeft: theme.spacing[2],
    paddingRight: theme.spacing[4],
  },
  calendarContainer: {
    paddingTop: theme.spacing[6],
    height: '750px',
  },
}));

function UserProgramKanban({ program, classe, session, inTab, useAllColumns = false }) {
  const { classes: styles } = Styles({ inTab });
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

  const history = useHistory();

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

  const onNewEvent = () => {
    store.selectedEvent = null;
    openEventModal();
  };

  async function getKanbanColumns() {
    const { columns } = await listKanbanColumnsRequest();
    const orderedColumns = _.orderBy(columns, ['order'], ['asc']);
    return _.filter(orderedColumns, (column) => [2, 3, 4, 5].includes(column.order));
    /*
    return useAllColumns
      ? orderedColumns
      : _.filter(orderedColumns, (column) => [2, 3, 4, 5].includes(column.order));
  */
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

      /*
      const start = new Date();
      const end = new Date();
      end.setDate(end.getDate() + 5);

       */
      const calendarIds = map(store.data.onlyProgramCalendars, 'id');
      cards = _.filter(cards, (c) => {
        /*
        const endDate = new Date(c.endDate);
        if (endDate < start || endDate > end) {
          return false;
        }
        if (calendarIds.includes(c.calendar)) {
          return true;
        }
         */
        let toReturn = false;
        if (c.type === 'plugins.calendar.task' && c.data && c.data.classes) {
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

  function onClickCard({ bgColor, icon, borderColor, ...e }) {
    store.selectedEvent = e;
    openEventModal();
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

  useEffect(() => {
    hooks.addAction('calendar:force:reload', load);
    return () => {
      hooks.removeAction('calendar:force:reload', load);
    };
  });

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
    _.forEach(store.data.events, (event) => {
      const card = cardsById[event.id];
      if (event.data && event.data.column && card && event.data.column !== card.data.column) {
        changedColumns.push(card.data.column);
        // eslint-disable-next-line no-param-reassign
        event.data.column = card.data.column;
        updateEventRequest(store.center.token, event.id, { data: event.data });
        hooks.fireEvent('calendar:kanban:reorded', { id: event.id, column: event.data.column });
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

  return (
    <Box className={styles.root}>
      <Stack fullWidth alignItems="center" justifyContent="space-between">
        <Box>
          {!inTab ? (
            <>
              <PluginKanbanIcon />
              <Text size="lg" color="primary" className={styles.title}>
                {t('kanban')}
              </Text>
            </>
          ) : null}

          {/* <Text color="soft">{t('description')}</Text> */}
          {/* <Button variant="link" onClick={() => history.push('/private/calendar/kanban')}>
            {t('showAllKanban')}
            <ChevRightIcon />
          </Button> */}
        </Box>
        <Box>
          {!store.loading ? (
            <IconButton color="primary" size="lg" rounded onClick={onNewEvent}>
              <PlusIcon />
            </IconButton>
          ) : null}
        </Box>
      </Stack>

      {!store.loading ? (
        <Box className={styles.calendarContainer}>
          <EventModal
            centerToken={store.centers[0].token}
            event={store.selectedEvent}
            close={toggleEventModal}
            classCalendars={store.filtersData.calendars}
            forceType={'plugins.calendar.task'}
          />
          <BubblesKanban
            value={store.board}
            onChange={onChange}
            disableCardDrag={false}
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
