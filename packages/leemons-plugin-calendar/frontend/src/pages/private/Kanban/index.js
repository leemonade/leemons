import * as _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { getCentersWithToken } from '@users/session';
import {
  getCalendarsToFrontendRequest,
  listKanbanColumnsRequest,
  listKanbanEventOrdersRequest,
  saveKanbanEventOrdersRequest,
  updateEventRequest,
} from '@calendar/request';
import { Button, Checkbox, FormControl } from 'leemons-ui';
import { useCalendarEventModal } from '@calendar/components/calendar-event-modal';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import tKeys from '@multilanguage/helpers/tKeys';
import hooks from 'leemons-hooks';
import getCalendarNameWithConfigAndSession from '@calendar/helpers/getCalendarNameWithConfigAndSession';
import { Kanban as BubblesKanban } from '@bubbles-ui/components';
import { KanbanTaskCard } from '@bubbles-ui/leemons';

function Kanban({ session }) {
  const [centers, setCenters] = useState([]);
  const [center, setCenter] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [data, setData] = useState(null);
  const [taskCalendars, setTaskCalendars] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [toggleEventModal, EventModal] = useCalendarEventModal();
  const [columns, setColumns] = useState([]);
  const [columnsT, setColumnsT] = useState([]);
  const [columnsEventsOrder, setColumnsEventsOrder] = useState({});
  const [onlyShowCalendars, setOnlyShowCalendars] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  async function getKanbanColumnsEventsOrder() {
    const { orders } = await listKanbanEventOrdersRequest(center.token);
    const obj = {};
    _.forEach(orders, (order) => {
      obj[order.column] = order.events;
    });
    setColumnsEventsOrder(obj);
  }

  async function getKanbanColumns() {
    const { columns: _columns } = await listKanbanColumnsRequest();
    setColumns(_.orderBy(_columns, ['order'], ['asc']));
  }

  async function getCalendarsForCenter() {
    const { calendars, events, userCalendar, ownerCalendars } = await getCalendarsToFrontendRequest(
      center.token
    );

    setData({
      calendars: _.map(calendars, (calendar) => ({
        ...calendar,
        name: getCalendarNameWithConfigAndSession(
          calendar,
          { calendars, events, userCalendar, ownerCalendars },
          session
        ),
      })),
      events,
      userCalendar,
      ownerCalendars,
    });
  }

  async function getTranslationColumns() {
    const keys = _.map(columns, 'nameKey');
    const { items } = await getLocalizationsByArrayOfItems(keys);
    setColumnsT(items);
  }

  function getColumnName(name) {
    return tKeys(name, columnsT);
  }

  useEffect(() => {
    hooks.addAction('calendar:force:reload', getCalendarsForCenter);
    return () => {
      hooks.removeAction('calendar:force:reload', getCalendarsForCenter);
    };
  });

  useEffect(() => {
    getKanbanColumns();
    setCenters(getCentersWithToken());
  }, []);

  useEffect(() => {
    if (center) {
      getKanbanColumnsEventsOrder();
      getCalendarsForCenter();
    }
  }, [center]);

  useEffect(() => {
    getTranslationColumns();
  }, [columns]);

  useEffect(() => {
    setOnlyShowCalendars([]);
  }, [taskCalendars]);

  useEffect(() => {
    if (data) {
      const eventsTasks = _.filter(data.events, { type: 'plugins.calendar.task' });
      const calendarIds = _.uniq(_.map(eventsTasks, 'calendar'));

      const calendars = _.filter(
        data.calendars,
        (calendar) => calendarIds.indexOf(calendar.id) >= 0
      );
      if (!_.isEqual(_.map(calendars, 'id'), _.map(taskCalendars, 'id'))) {
        // Calendarios de la seccion tareas
        setTaskCalendars(calendars);
      }

      // Eventos
      /*
      const events = [];
      const calendarsByKey = _.keyBy(calendars, 'id');
      _.forEach(data.events, (event) => {
        if (calendarsByKey[event.calendar] && calendarsByKey[event.calendar].showEvents) {
          events.push(event);
        }
      });
       */
      setFilteredEvents(data.events);
    }
  }, [data]);

  useEffect(() => {
    if (centers.length) setCenter(centers[0]);
  }, [centers]);

  function onNewEvent() {
    setSelectedEvent(null);
    toggleEventModal();
  }

  function onClickCard(event) {
    setSelectedEvent(event);
    toggleEventModal();
  }

  function onCalendarsChange(event, calendar) {
    const index = onlyShowCalendars.indexOf(calendar.id);
    if (index >= 0) {
      onlyShowCalendars.splice(index, 1);
    } else {
      onlyShowCalendars.push(calendar.id);
    }
    if (taskCalendars.length === onlyShowCalendars.length) {
      onlyShowCalendars.splice(0, onlyShowCalendars.length);
    }
    setOnlyShowCalendars([...onlyShowCalendars]);
  }

  const board = useMemo(() => {
    const cols = [];
    if (columns && columnsT) {
      const eventsByColumn = _.groupBy(filteredEvents, 'data.column');
      _.forEach(columns, (column) => {
        if (!column.isArchived || (column.isArchived && showArchived)) {
          let cards = [];
          if (eventsByColumn[column.id] && columnsEventsOrder[column.id]) {
            const cardsNoOrdered = [];
            _.forEach(eventsByColumn[column.id], (event) => {
              const index = columnsEventsOrder[column.id].indexOf(event.id);
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

          if (onlyShowCalendars.length) {
            cards = _.filter(cards, (c) => onlyShowCalendars.indexOf(c.calendar) >= 0);
          }

          cols.push({
            id: column.id,
            title: getColumnName(column.nameKey),
            cards,
          });
        }
      });
    }
    return { columns: cols };
  }, [
    columns,
    columnsT,
    filteredEvents,
    columnsEventsOrder,
    onlyShowCalendars,
    showArchived,
    data,
    session,
  ]);

  const onCardDragEnd = async (event, from, to) => {
    const calendar = _.find(data.ownerCalendars, {
      id: _.isString(event.calendar) ? event.calendar : event.calendar.id,
    });
    const isOwner = !!calendar;
    if (isOwner) {
      const index = _.findIndex(data.events, { id: event.id });

      const { cards } = _.find(board.columns, { id: to.toColumnId });
      const cardEventIndex = _.findIndex(cards, { id: event.id });
      if (cardEventIndex >= 0) cards.splice(cardEventIndex, 1);
      cards.splice(to.toPosition, 0, event);

      columnsEventsOrder[to.toColumnId] = _.map(cards, 'id');

      if (index >= 0 && event.data.column !== to.toColumnId) {
        data.events[index].data.column = to.toColumnId;
        updateEventRequest(center.token, event.id, { data: data.events[index].data });
      }

      saveKanbanEventOrdersRequest(center.token, to.toColumnId, columnsEventsOrder[to.toColumnId]);

      setData({ ...data });
      setColumnsEventsOrder({ ...columnsEventsOrder });
    }
  };

  const disableCardDrag = useMemo(() => {
    if (onlyShowCalendars && onlyShowCalendars.length) return true;
    return false;
  }, [onlyShowCalendars]);

  function onChange(values) {
    const cardsById = {};
    _.forEach(values.columns, (column) => {
      _.forEach(column.cards, (card) => {
        cardsById[card.id] = { ...card, data: { ...card.data, column: column.id } };
      });
    });
    const changedColumns = [];
    _.forEach(data.events, (event) => {
      const card = cardsById[event.id];
      if (event.data && event.data.column && card && event.data.column !== card.data.column) {
        // eslint-disable-next-line no-param-reassign
        event.data.column = card.data.column;
        changedColumns.push(card.data.column);
        updateEventRequest(center.token, event.id, { data: event.data });
      }
    });

    _.forEach(values.columns, (column) => {
      if (changedColumns.indexOf(column.id) < 0) {
        columnsEventsOrder[column.id] = _.map(column.cards, 'id');
        saveKanbanEventOrdersRequest(center.token, column.id, columnsEventsOrder[column.id]);
      }
    });

    setData({ ...data });
    setColumnsEventsOrder({ ...columnsEventsOrder });
  }

  return (
    <div className="bg-primary-content">
      {center ? (
        <EventModal
          centerToken={center.token}
          event={selectedEvent}
          close={toggleEventModal}
          forceType="plugins.calendar.task"
        />
      ) : null}
      {centers.length > 1 ? (
        <>
          {centers.map((_center) => (
            <Button key={_center.id} onClick={() => setCenter(_center)}>
              {_center.name}
            </Button>
          ))}
        </>
      ) : null}
      <Button color="primary" onClick={onNewEvent}>
        Añadir tarea
      </Button>
      <div>
        {taskCalendars.map((calendar) => (
          <FormControl
            key={calendar.id}
            label={getCalendarNameWithConfigAndSession(calendar, data, session)}
            labelPosition="right"
          >
            <Checkbox
              checked={onlyShowCalendars.indexOf(calendar.id) >= 0}
              onChange={(e) => onCalendarsChange(e, calendar)}
            />
          </FormControl>
        ))}

        <FormControl label={'Mostrar archivadas'} labelPosition="right">
          <Checkbox checked={showArchived} onChange={() => setShowArchived(!showArchived)} />
        </FormControl>
      </div>

      {board ? (
        <BubblesKanban
          value={board}
          onChange={onChange}
          disableCardDrag={disableCardDrag}
          itemRender={(props) => <KanbanTaskCard config={data} {...props} />}
        />
      ) : null}
    </div>
  );
}

export default Kanban;
