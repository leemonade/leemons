import * as _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
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
import { getEventTypesRequest } from '../request';
import getCalendarNameWithConfigAndSession from '../helpers/getCalendarNameWithConfigAndSession';

function CalendarEventModal({ event, centerToken }) {
  const session = useSession({ redirectTo: goLoginPage });
  const [t] = useTranslateLoader(prefixPN('event_modal'));
  const { t: tCommon } = useCommonTranslate('forms');
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

    setCalendarData({
      calendars,
      events,
      userCalendar,
      ownerCalendars,
    });
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
      startDate.setUTCHours(startTime[0], startTime[1], startTime[2]);
      endDate.setUTCHours(endTime[0], endTime[1], endTime[2]);
    }
    const toSend = {
      startDate,
      endDate,
      ...formData,
    };
    console.log(toSend);
  };

  const init = async () => {
    const [_eventTypes] = await Promise.all([getEventTypes(), getCalendarsForCenter()]);
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
      setValue('type', _eventTypes[0].key);
      setValue('repeat', 'dont_repeat');
      setValue('isAllDay', false);
    }
  };

  useEffect(() => {
    init();
  }, []);

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
              <option key={calendar.id} value={calendar.id}>
                {getCalendarNameWithConfigAndSession(calendar, calendarData, session)}
              </option>
            ))}
          </Select>
        ) : null}

        <Button color="primary" className="mt-4">
          {t('save')}
        </Button>
      </form>
    </div>
  );
}

CalendarEventModal.propTypes = {
  event: PropTypes.object,
  centerToken: PropTypes.string.isRequired,
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
