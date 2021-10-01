import * as _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { Button, Checkbox, Drawer, FormControl, Input, Radio, Select, useDrawer } from 'leemons-ui';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@calendar/helpers/prefixPN';
import { useForm } from 'react-hook-form';
import tKeys from '@multilanguage/helpers/tKeys';
import PropTypes from 'prop-types';
import { dynamicImport } from '@common/dynamicImport';
import { getCalendarsToFrontendRequest } from '@calendar/request';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import hooks from 'leemons-hooks';
import {
  addEventRequest,
  getEventTypesRequest,
  removeEventRequest,
  updateEventRequest,
} from '../request';
import getCalendarNameWithConfigAndSession from '../helpers/getCalendarNameWithConfigAndSession';

function CalendarEventModal({ event, centerToken, close, forceType }) {
  const session = useSession({ redirectTo: goLoginPage });
  const [t] = useTranslateLoader(prefixPN('event_modal'));
  const { t: tCommon } = useCommonTranslate('forms');
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [isNew, setIsNew] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [calendarData, setCalendarData] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [eventTypesT, setEventTypesT] = useState([]);
  const eventTypeComponent = useRef();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    unregister,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm();

  const getCalendarsForCenter = async () => {
    const { calendars, events, userCalendar, ownerCalendars } = await getCalendarsToFrontendRequest(
      centerToken
    );

    const _data = {
      calendars,
      events,
      userCalendar,
      ownerCalendars,
    };

    setCalendarData(_data);
    return _data;
  };

  const getEventTypes = async () => {
    const response = await getEventTypesRequest();
    setEventTypes(response.eventTypes);
    return response.eventTypes;
  };

  const getEventTypeTranslations = async () => {
    const { items } = await getLocalizationsByArrayOfItems(_.map(eventTypes, 'key'));
    setEventTypesT(items);
  };

  const getEventTypeName = (sectionName) => tKeys(sectionName, eventTypesT);

  const reloadCalendar = () => {
    hooks.fireEvent('calendar:force:reload');
  };

  const getUTCString = (date) => {
    const month = (parseInt(date.getUTCMonth().toString(), 10) + 1).toString();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return `${date.getUTCFullYear()}-${month.toString().length === 1 ? `0${month}` : month}-${
      day.toString().length === 1 ? `0${day}` : day
    } ${hours.toString().length === 1 ? `0${hours}` : hours}:${
      minutes.toString().length === 1 ? `0${minutes}` : minutes
    }:${seconds.toString().length === 1 ? `0${seconds}` : seconds}`;
  };

  const onSubmit = async (_formData) => {
    // eslint-disable-next-line prefer-const
    let { startDate, endDate, startTime, endTime, ...formData } = _formData;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    if (formData.isAllDay) {
      startDate.setUTCHours(0, 0, 0);
      endDate.setUTCHours(23, 59, 59);
    } else {
      startTime = startTime.split(':');
      endTime = endTime.split(':');
      startDate.setUTCHours(
        startTime[0] ? parseInt(startTime[0], 10) : 0,
        startTime[1] ? parseInt(startTime[1], 10) : 0,
        startTime[2] ? parseInt(startTime[2], 10) : 0
      );
      endDate.setUTCHours(
        endTime[0] ? parseInt(endTime[0], 10) : 0,
        endTime[1] ? parseInt(endTime[1], 10) : 0,
        endTime[2] ? parseInt(endTime[2], 10) : 0
      );
    }

    const toSend = {
      startDate: getUTCString(startDate),
      endDate: getUTCString(endDate),
      ...formData,
    };

    try {
      if (isNew) {
        await addEventRequest(centerToken, toSend);
        addSuccessAlert(t('add_done'));
      } else {
        delete toSend.calendar;
        delete toSend.type;
        delete toSend.status;
        await updateEventRequest(centerToken, event.id, toSend);
        addSuccessAlert(t('updated_done'));
      }
      reloadCalendar();
      close();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  const removeEvent = async () => {
    try {
      await removeEventRequest(centerToken, event.id);
      reloadCalendar();
      close();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  const init = async () => {
    const [_eventTypes, _calendarData] = await Promise.all([
      getEventTypes(),
      getCalendarsForCenter(),
    ]);
    if (event) {
      const {
        startDate,
        endDate,
        isAllDay,
        calendar,
        data,
        id,
        // eslint-disable-next-line camelcase
        created_at,
        // eslint-disable-next-line camelcase
        updated_at,
        ...eventData
      } = event;
      _.forIn(eventData, (value, key) => {
        setValue(key, value);
      });
      if (!eventData.repeat) setValue('repeat', 'dont_repeat');
      const calendarId = _.isString(calendar) ? calendar : calendar.id;
      const _calendar = _.find(_calendarData.ownerCalendars, { id: calendarId });
      if (_calendar) setValue('calendar', _calendar.key);
      setValue('isAllDay', !!isAllDay);
      const _startDate = new Date(startDate);
      const _endDate = new Date(endDate);
      _startDate.setSeconds(0, 0);
      _endDate.setSeconds(0, 0);

      const sdIsoArr = _startDate.toISOString().split('T');
      setValue('startDate', sdIsoArr[0]);
      setValue('startTime', sdIsoArr[1].split('.')[0]);

      const edIsoArr = _endDate.toISOString().split('T');
      setValue('endDate', edIsoArr[0]);
      setValue('endTime', edIsoArr[1].split('.')[0]);
    } else if (_eventTypes.length) {
      setValue('type', forceType || _eventTypes[0].key);
      setValue('repeat', 'dont_repeat');
      setValue('isAllDay', false);
      if (_calendarData && _calendarData.ownerCalendars)
        setValue('calendar', _calendarData.ownerCalendars[0].key);
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    setIsNew(!event);
  }, [event]);

  useEffect(() => {
    if (event && calendarData) {
      const calendar = _.find(calendarData.ownerCalendars, {
        id: _.isString(event.calendar) ? event.calendar : event.calendar.id,
      });
      setIsOwner(!!calendar);
    }
  }, [event, calendarData]);

  useEffect(() => {
    getEventTypeTranslations();
  }, [eventTypes]);

  register(`isAllDay`);
  const isAllDay = watch('isAllDay');

  const formType = watch('type');
  if (formType) {
    const eventType = _.find(eventTypes, { key: formType });
    if (
      eventType &&
      (!eventTypeComponent.current || eventTypeComponent.current.type !== eventType.key)
    ) {
      eventTypeComponent.current = {
        Component: dynamicImport(eventType.url),
        type: eventType.key,
      };
    }
  }

  return (
    <div style={{ width: '400px' }} className="p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl label={t('title')} className="w-full" formError={_.get(errors, `title`)}>
          <Input
            className="w-full"
            outlined={true}
            {...register(`title`, {
              required: tCommon('required'),
            })}
          />
        </FormControl>
        {!forceType ? (
          <>
            {eventTypes.map((eventType) => (
              <div key={eventType.key} className="flex">
                <FormControl label={getEventTypeName(eventType.key)} labelPosition="right">
                  <Radio
                    color={_.get(errors, `type`) ? 'error' : 'primary'}
                    name={eventType.key}
                    checked={watch('type') === eventType.key}
                    onChange={() => setValue('type', eventType.key)}
                    value={eventType.key}
                  />
                </FormControl>
              </div>
            ))}
          </>
        ) : null}
        <FormControl className="w-full" formError={_.get(errors, `startDate`)}>
          <Input
            type="date"
            className="w-full"
            outlined={true}
            {...register(`startDate`, {
              required: tCommon('required'),
            })}
          />
        </FormControl>
        {!isAllDay ? (
          <FormControl className="w-full" formError={_.get(errors, `startTime`)}>
            <Input
              type="time"
              className="w-full"
              outlined={true}
              {...register(`startTime`, {
                required: tCommon('required'),
              })}
            />
          </FormControl>
        ) : null}
        <FormControl className="w-full" formError={_.get(errors, `endDate`)}>
          <Input
            type="date"
            className="w-full"
            outlined={true}
            {...register(`endDate`, {
              required: tCommon('required'),
            })}
          />
        </FormControl>
        {!isAllDay ? (
          <FormControl className="w-full" formError={_.get(errors, `endTime`)}>
            <Input
              type="time"
              className="w-full"
              outlined={true}
              {...register(`endTime`, {
                required: tCommon('required'),
              })}
            />
          </FormControl>
        ) : null}
        <FormControl labelPosition="right" label={t('all_day')}>
          <Checkbox
            color="secondary"
            checked={watch('isAllDay')}
            onChange={(e) => setValue('isAllDay', e.target.checked)}
          />
        </FormControl>
        <Select
          outlined
          {...register(`repeat`, {
            required: tCommon('required'),
          })}
        >
          <option value="dont_repeat">{t('repeat.dont_repeat')}</option>
          <option value="every_day">{t('repeat.every_day')}</option>
          <option value="every_week">{t('repeat.every_week')}</option>
          <option value="every_month">{t('repeat.every_month')}</option>
          <option value="every_year">{t('repeat.every_year')}</option>
        </Select>
        {eventTypeComponent.current && eventTypeComponent.current.Component ? (
          <eventTypeComponent.current.Component
            event={event}
            isEditing={true}
            allFormData={watch()}
            data={watch('data')}
            tCommon={tCommon}
            form={{
              register: (ref, options) => register(`data.${ref}`, options),
              setValue: (ref, value, options) => setValue(`data.${ref}`, value, options),
              getValues: (refs) => {
                if (_.isArray(refs)) return getValues(_.map(refs, (ref) => `data.${ref}`));
                return getValues(`data.${refs}`);
              },
              watch: (refs, options) => {
                if (_.isFunction(refs)) {
                  return watch(refs, options);
                }
                if (_.isArray(refs)) {
                  return watch(
                    _.map(refs, (ref) => `data.${ref}`),
                    options
                  );
                }
                return watch(`data.${refs}`, options);
              },
              unregister: (refs) => {
                if (_.isArray(refs)) return unregister(_.map(refs, (ref) => `data.${ref}`));
                return unregister(`data.${refs}`);
              },
              trigger: (refs) => {
                if (_.isArray(refs)) return trigger(_.map(refs, (ref) => `data.${ref}`));
                return trigger(`data.${refs}`);
              },
              formState: { errors: errors ? errors.data : {}, isSubmitted },
            }}
          />
        ) : null}
        {calendarData && calendarData.ownerCalendars ? (
          <Select
            outlined
            {...register(`calendar`, {
              required: tCommon('required'),
            })}
          >
            {calendarData.ownerCalendars.map((calendar) => (
              <option key={calendar.id} value={calendar.key}>
                {getCalendarNameWithConfigAndSession(calendar, calendarData, session)}
              </option>
            ))}
          </Select>
        ) : null}
        {isNew ? (
          <Button color="primary" className="mt-4">
            {t('save')}
          </Button>
        ) : null}
        {!isNew && isOwner ? (
          <Button color="primary" className="mt-4">
            {t('update')}
          </Button>
        ) : null}
        {!isNew ? (
          <Button type="button" color="error" className="mt-4" onClick={removeEvent}>
            Borrar T
          </Button>
        ) : null}
      </form>
    </div>
  );
}

CalendarEventModal.propTypes = {
  event: PropTypes.object,
  centerToken: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  forceType: PropTypes.string,
};

export const useCalendarEventModal = () => {
  const [drawer, toggleDrawer] = useDrawer({
    animated: true,
    side: 'right',
  });

  return [
    toggleDrawer,
    function (data) {
      return (
        <Drawer {...drawer}>
          <CalendarEventModal {...data} />
        </Drawer>
      );
    },
  ];
};
