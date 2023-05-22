/* eslint-disable react/display-name */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

import { Box, ImageLoader, LoadingOverlay, UserDisplayItemList } from '@bubbles-ui/components';
import { CALENDAR_EVENT_MODAL_DEFAULT_PROPS, CalendarEventModal } from '@bubbles-ui/leemons';
import { getCalendarsToFrontendRequest } from '@calendar/request';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import loadable from '@loadable/component';
import tKeys from '@multilanguage/helpers/tKeys';
import { getLocalizations, getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import { goLoginPage } from '@users/navigate';
import { getCentersWithToken, useSession } from '@users/session';
import * as _ from 'lodash';
import { find, forEach, isString, map, set } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import prefixPN from '@calendar/helpers/prefixPN';
import { getLocale, useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import SelectUserAgent from '@users/components/SelectUserAgent';
import hooks from 'leemons-hooks';
import getCalendarNameWithConfigAndSession from '../helpers/getCalendarNameWithConfigAndSession';
import getUTCString from '../helpers/getUTCString';
import {
  addEventRequest,
  getEventTypesRequest,
  removeEventRequest,
  updateEventRequest,
} from '../request';

function dynamicImport(pluginName, component) {
  return loadable(() =>
    import(`@leemons/plugins/${pluginName}/src/widgets/calendar/${component}.js`)
  );
}

function ClassIcon({ class: klass, dropdown = false }) {
  return (
    <Box
      sx={() => ({
        position: dropdown ? 'static' : 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 24,
        minHeight: 24,
        maxWidth: 24,
        maxHeight: 24,
        borderRadius: '50%',
        backgroundColor: klass?.bgColor,
      })}
    >
      <ImageLoader
        sx={() => ({
          borderRadius: 0,
          filter: 'brightness(0) invert(1)',
        })}
        forceImage
        width={14}
        height={14}
        src={klass.icon}
      />
    </Box>
  );
}

ClassIcon.propTypes = {
  class: PropTypes.object,
  dropdown: PropTypes.bool,
};

const UsersComponent = React.forwardRef(
  ({ userAgents, showLess, showMore, disabled, labelDisabled, label, ...props }) => (
    <Box>
      {disabled ? (
        <UserDisplayItemList
          data={map(userAgents, 'user')}
          labels={{
            showMore,
            showLess,
          }}
        />
      ) : (
        <SelectUserAgent
          {...props}
          maxSelectedValues={99999}
          onlyContacts
          label={disabled ? labelDisabled : label}
        />
      )}
    </Box>
  )
);

UsersComponent.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  showMore: PropTypes.string,
  showLess: PropTypes.string,
  labelDisabled: PropTypes.string,
  userAgents: PropTypes.any,
};

function NewCalendarEventModal({
  opened,
  centerToken,
  event,
  forceType,
  onClose,
  close,
  classCalendars,
  reff: ref,
  ref2,
}) {
  const { t: tCommon } = useCommonTranslate('forms');
  const session = useSession({ redirectTo: goLoginPage });
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [t] = useTranslateLoader(prefixPN('event_modal'));
  const [, setR] = useState();
  const form = useForm({ defaultValues: ref.current.defaultValues });

  function render() {
    setR(new Date().getTime());
  }

  async function getCalendarsForCenter() {
    const { calendars, events, userCalendar, ownerCalendars } = await getCalendarsToFrontendRequest(
      centerToken
    );

    return {
      calendars,
      events,
      userCalendar,
      ownerCalendars,
      centerToken,
    };
  }

  async function getEventTypes() {
    const { eventTypes } = await getEventTypesRequest();

    const keys = [];
    _.forEach(eventTypes, (eventType) => {
      if (eventType.config?.titlePlaceholder) {
        keys.push(eventType.config?.titlePlaceholder);
      }
      if (eventType.config?.titleLabel) {
        keys.push(eventType.config?.titleLabel);
      }
      if (eventType.config?.fromLabel) {
        keys.push(eventType.config?.fromLabel);
      }
      if (eventType.config?.toLabel) {
        keys.push(eventType.config?.toLabel);
      }
    });

    const { items } = await getLocalizations({ keys });

    _.forEach(eventTypes, (eventType) => {
      if (eventType.config?.titlePlaceholder) {
        eventType.config.titlePlaceholder =
          items[eventType.config.titlePlaceholder] || eventType.config.titlePlaceholder;
      }
      if (eventType.config?.titleLabel) {
        eventType.config.titleLabel =
          items[eventType.config.titleLabel] || eventType.config.titleLabel;
      }
      if (eventType.config?.fromLabel) {
        eventType.config.fromLabel =
          items[eventType.config.fromLabel] || eventType.config.fromLabel;
      }
      if (eventType.config?.toLabel) {
        eventType.config.toLabel = items[eventType.config.toLabel] || eventType.config.toLabel;
      }
      if (!eventType.config) {
        eventType.config = {};
      }
    });

    return eventTypes;
  }

  async function getEventTypeTranslations(eventTypes) {
    const { items } = await getLocalizationsByArrayOfItems(_.map(eventTypes, 'key'));
    return items;
  }

  function getEventTypeName(sectionName, eventTypesTranslations) {
    return tKeys(sectionName, eventTypesTranslations);
  }

  async function init() {
    ref.current.loading = true;
    render();
    try {
      ref.current.eventId = event?.id;
      if (!ref.current.repeat) {
        ref.current.repeat = map(
          CALENDAR_EVENT_MODAL_DEFAULT_PROPS.selectData.repeat,
          ({ value }) => ({
            value,
            label: t(`repeat.${value}`),
          })
        );
      }

      if (!ref.current.eventTypes) {
        const eventTypes = await getEventTypes();
        const eventTypesTranslations = await getEventTypeTranslations(eventTypes);
        ref.current.eventTypes = map(eventTypes, (eventType) => ({
          ...eventType,
          value: eventType.key,
          label: getEventTypeName(eventType.key, eventTypesTranslations),
        }));
        ref.current.components = {};
        forEach(ref.current.eventTypes, (eventType) => {
          ref.current.components[eventType.key] = dynamicImport(
            `${eventType.pluginName}`,
            eventType.url
          );
        });
      }

      ref.current.calendarData = await getCalendarsForCenter();
      ref.current.calendarData.calendars = map(ref.current.calendarData.calendars, (calendar) => ({
        ...calendar,
        value: calendar.key,
        label: getCalendarNameWithConfigAndSession(calendar, ref.current.calendarData, session),
      }));
      ref.current.calendarData.ownerCalendars = map(
        ref.current.calendarData.ownerCalendars,
        (calendar) => ({
          ...calendar,
          value: calendar.key,
          label: getCalendarNameWithConfigAndSession(calendar, ref.current.calendarData, session),
        })
      );

      ref.current.defaultValues = {};
      ref.current.isNew = true;
      ref.current.isOwner = false;

      if (event) {
        ref.current.fromCalendar = event.fromCalendar;
        ref.current.isNew = false;
        const centers = getCentersWithToken();
        if (centers && centers.length) {
          let isOwner = false;
          forEach(centers, ({ userAgentId }) => {
            if (event.owners.includes(userAgentId)) {
              isOwner = true;
            }
          });
          ref.current.isOwner = isOwner;
        }
        /*
        ref.current.isOwner = !!_.find(ref.current.calendarData.ownerCalendars, {
          id: _.isString(event.calendar) ? event.calendar : event.calendar.id,
        });

         */

        const {
          startDate,
          endDate,
          isAllDay,
          calendar,
          id,
          deleted,
          fromCalendar,
          created_at,
          updated_at,
          deleted_at,
          ...eventData
        } = event;

        _.forIn(eventData, (value, key) => {
          set(ref.current.defaultValues, key, value);
        });

        if (!ref.current.defaultValues.repeat)
          set(ref.current.defaultValues, 'repeat', 'dont_repeat');
        const calendarId = isString(calendar) ? calendar : calendar.id;
        const foundCalendar = find(ref.current.calendarData.ownerCalendars, { id: calendarId });
        if (foundCalendar) set(ref.current.defaultValues, 'calendar', foundCalendar.key);
        set(ref.current.defaultValues, 'isAllDay', !!isAllDay);

        if (startDate) {
          const start = new Date(startDate);
          start.setSeconds(0, 0);
          set(ref.current.defaultValues, 'startDate', start);
          set(ref.current.defaultValues, 'startTime', start);
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setSeconds(0, 0);
          set(ref.current.defaultValues, 'endDate', end);
          set(ref.current.defaultValues, 'endTime', end);
        }
      } else if (ref.current.eventTypes.length) {
        set(ref.current.defaultValues, 'type', forceType || ref.current.eventTypes[0].key);
        set(ref.current.defaultValues, 'repeat', 'dont_repeat');
        set(ref.current.defaultValues, 'isAllDay', false);
        if (ref.current.calendarData && ref.current.calendarData.ownerCalendars)
          set(
            ref.current.defaultValues,
            'calendar',
            ref.current.calendarData.ownerCalendars[0].key
          );
      }
    } catch (e) {}

    form.reset(ref.current.defaultValues);
    ref.current.loading = false;
    render();
  }

  async function reloadCalendar() {
    await hooks.fireEvent('calendar:force:reload');
  }

  async function removeEvent() {
    try {
      await removeEventRequest(centerToken, event.id);
      await reloadCalendar();
      close();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  async function onSubmit(_formData, { closeOnSend = true }) {
    // eslint-disable-next-line prefer-const
    ref.current.saving = true;
    render();
    let { startDate, endDate, deadline, uniqClasses, startTime, endTime, ...formData } = _formData;
    if (startDate) startDate = new Date(startDate);
    if (endDate) endDate = new Date(endDate);
    if (formData.isAllDay) {
      if (startDate) startDate.setHours(0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59);
    } else {
      if (startDate) {
        startDate.setHours(
          startTime ? startTime.getHours() : 0,
          startTime ? startTime.getMinutes() : 0,
          startTime ? startTime.getSeconds() : 0
        );
      }
      if (endDate) {
        endDate.setHours(
          endTime ? endTime.getHours() : 0,
          endTime ? endTime.getMinutes() : 0,
          endTime ? endTime.getSeconds() : 0
        );
      }
    }

    const toSend = {
      startDate: startDate ? getUTCString(startDate) : null,
      endDate: endDate ? getUTCString(endDate) : null,
      ...formData,
    };

    try {
      if (ref.current.isNew) {
        await addEventRequest(centerToken, toSend);
        addSuccessAlert(t('add_done'));
      } else {
        // delete toSend.calendar;
        // delete toSend.type;
        delete toSend.status;
        const { event: e } = await updateEventRequest(centerToken, event.id, toSend);
        ref.current.defaultValues.data = e.data;

        addSuccessAlert(t('updated_done'));
      }
      reloadCalendar();
      if (closeOnSend) {
        ref.current.eventId = null;
        close();
      }
      ref.current.saving = false;
      render();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  }

  function onKanbanReorded({ args: [{ id, column }] }) {
    if (event && event.id === id) {
      ref.current.defaultValues.data.column = column;
      form.setValue('data.column', column);
    }
  }

  useEffect(() => {
    if (session && opened && (!event || event.id !== ref.current.eventId)) {
      init();
    }
  }, [session, event]);

  useEffect(() => {
    hooks.addAction('calendar:kanban:reorded', onKanbanReorded);
    return () => {
      hooks.removeAction('calendar:kanban:reorded', onKanbanReorded);
    };
  });

  if (ref.current.loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <>
      {ref.current.saving ? <LoadingOverlay visible /> : null}
      <CalendarEventModal
        form={form}
        opened={opened}
        locale={getLocale(session)}
        fromCalendar={ref.current.fromCalendar}
        onRemove={removeEvent}
        isNew={ref.current.isNew}
        isOwner={ref.current.isOwner}
        forceType={forceType}
        parent={{
          store: ref2.current,
          getEventId: () => event.id,
          setSaving: (saving) => {
            ref.current.saving = saving;
            render();
          },
          reloadCalendar,
          defaultValues: ref.current.defaultValues,
          render,
          addSuccessAlertAdd: () => addSuccessAlert(t('add_done')),
          addSuccessAlertUpdate: () => addSuccessAlert(t('updated_done')),
          addErrorAlert: (e) => addErrorAlert(getErrorMessage(e)),
        }}
        selectData={{
          repeat: ref.current.repeat,
          eventTypes: ref.current.eventTypes,
          calendars: ref.current.calendarData?.ownerCalendars.map((value) => {
            if (!value.isClass) return value;
            return { ...value, icon: <ClassIcon class={value} dropdown /> };
          }),
        }}
        onSubmit={onSubmit}
        UsersComponent={
          <UsersComponent
            label={t('users')}
            labelDisabled={t('usersDisabled')}
            showMore={t('showMore')}
            showLess={t('showLess')}
            userAgents={ref.current.defaultValues?.userAgents}
          />
        }
        components={ref.current.components}
        onClose={onClose}
        defaultValues={ref.current.defaultValues}
        classCalendars={classCalendars}
        messages={{
          subtasks: t('subtasks'),
          fromLabel: t('from'),
          toLabel: t('to'),
          repeatLabel: t('repeatLabel'),
          allDayLabel: t('all_day'),
          titlePlaceholder: t('title'),
          cancelButtonLabel: t('cancel'),
          saveButtonLabel: t('save'),
          updateButtonLabel: t('update'),
          calendarPlaceholder: t('selectCalendar'),
          calendarLabel: t('calendarLabel'),
          calendarLabelDisabled: t('calendarLabelDisabled'),
          showInCalendar: t('showInCalendar'),
        }}
        errorMessages={{
          titleRequired: tCommon('required'),
          startDateRequired: tCommon('required'),
          startTimeRequired: tCommon('required'),
          endDateRequired: tCommon('required'),
          endTimeRequired: tCommon('required'),
          calendarRequired: tCommon('required'),
          typeRequired: tCommon('required'),
        }}
      />
    </>
  );
}

NewCalendarEventModal.propTypes = {
  opened: PropTypes.bool,
  centerToken: PropTypes.string,
  event: PropTypes.object,
  forceType: PropTypes.string,
  onClose: PropTypes.func,
  removeEvent: PropTypes.func,
  close: PropTypes.func,
  classCalendars: PropTypes.array,
  reff: PropTypes.any,
};

// eslint-disable-next-line import/prefer-default-export
export const useCalendarEventModal = () => {
  const [store, render] = useStore({
    opened: false,
  });
  const ref = useRef({ loading: false });
  const ref2 = useRef({});
  const element = (
    <NewCalendarEventModal
      ref2={ref2}
      reff={ref}
      opened={store.opened}
      onClose={() => {
        store.opened = false;
        render();
      }}
    />
  );

  const Component = React.useCallback(
    (data) => {
      if (data?.event?.canNotOpened) {
        store.opened = false;
        return null;
      }
      return React.cloneElement(element, data);
    },
    [store.opened]
  );

  return [
    function toggle() {
      store.opened = !store.opened;
      render();
    },
    Component,
    {
      opened: store.opened,
      openModal: () => {
        store.opened = true;
        render();
      },
      closeModal: () => {
        store.opened = false;
        render();
      },
    },
  ];
};
