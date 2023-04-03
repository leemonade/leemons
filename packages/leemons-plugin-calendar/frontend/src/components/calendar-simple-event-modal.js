import { Button, Checkbox, Drawer, Radio, Select, TextInput } from '@bubbles-ui/components';
import prefixPN from '@calendar/helpers/prefixPN';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import tKeys from '@multilanguage/helpers/tKeys';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import hooks from 'leemons-hooks';
import * as _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import getUTCString from '../helpers/getUTCString';
import {
  addConfigEventRequest,
  removeConfigEventRequest,
  updateConfigEventRequest,
} from '../request';

function CalendarSimpleEventModal({ event, eventTypes, close, config, calendars }) {
  const [t] = useTranslateLoader(prefixPN('event_modal'));
  const { t: tCommon } = useCommonTranslate('forms');
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [isNew, setIsNew] = useState(true);
  const [eventTypesT, setEventTypesT] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const init = async () => {
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

      setValue('startDate', moment(_startDate).format('YYYY-MM-DD'));
      setValue('startTime', moment(_startDate).format('HH:mm:ss'));
      setValue('endDate', moment(_endDate).format('YYYY-MM-DD'));
      setValue('endTime', moment(_endDate).format('HH:mm:ss'));
    } else if (eventTypes.length) {
      setValue('type', eventTypes[0].key);
      setValue('repeat', 'dont_repeat');
      setValue('isAllDay', false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const getEventTypeTranslations = async () => {
    const { items } = await getLocalizationsByArrayOfItems(_.map(eventTypes, 'key'));
    setEventTypesT(items);
  };

  const getEventTypeName = (sectionName) => tKeys(sectionName, eventTypesT);

  const reloadCalendar = () => {
    hooks.fireEvent('calendar:force:reload');
  };

  const onSubmit = async (_formData) => {
    // eslint-disable-next-line prefer-const
    let { startDate, endDate, startTime, endTime, ...formData } = _formData;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    if (formData.isAllDay) {
      startDate.setHours(0, 0, 0);
      endDate.setHours(23, 59, 59);
    } else {
      startTime = startTime.split(':');
      endTime = endTime.split(':');
      startDate.setHours(
        startTime[0] ? parseInt(startTime[0], 10) : 0,
        startTime[1] ? parseInt(startTime[1], 10) : 0,
        startTime[2] ? parseInt(startTime[2], 10) : 0
      );
      endDate.setHours(
        endTime[0] ? parseInt(endTime[0], 10) : 0,
        endTime[1] ? parseInt(endTime[1], 10) : 0,
        endTime[2] ? parseInt(endTime[2], 10) : 0
      );
    }

    const calendar = _.find(calendars, { name: formData.type });

    const toSend = {
      startDate: getUTCString(startDate),
      endDate: getUTCString(endDate),
      ...formData,
      calendar: calendar.id,
    };

    if (isNew) {
      await addConfigEventRequest(config.id, toSend);
      addSuccessAlert(t('add_done'));
    } else {
      toSend.id = event.id;
      await updateConfigEventRequest(config.id, toSend);
      addSuccessAlert(t('updated_done'));
    }

    reloadCalendar();
    close();
  };

  const removeEvent = async () => {
    try {
      await removeConfigEventRequest(config.id, event.id);
      reloadCalendar();
      close();
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  useEffect(() => {
    setIsNew(!event?.id);
  }, [event]);

  useEffect(() => {
    getEventTypeTranslations();
  }, [eventTypes]);

  register(`isAllDay`);
  const isAllDay = watch('isAllDay');

  return (
    <div style={{ width: '400px' }} className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <TextInput
          label={t('title')}
          error={_.get(errors, `title`)}
          className="w-full"
          outlined={true}
          {...register(`title`, {
            required: tCommon('required'),
          })}
        />
        {eventTypes.map((eventType) => (
          <div key={eventType.key} className="flex">
            <Radio
              label={getEventTypeName(eventType.key)}
              color={_.get(errors, `type`) ? 'error' : 'primary'}
              name={eventType.key}
              checked={watch('type') === eventType.key}
              onChange={() => setValue('type', eventType.key)}
              value={eventType.key}
            />
          </div>
        ))}
        <TextInput
          type="date"
          error={_.get(errors, `startDate`)}
          className="w-full"
          outlined={true}
          {...register(`startDate`, {
            required: tCommon('required'),
          })}
        />
        {!isAllDay ? (
          <TextInput
            type="time"
            error={_.get(errors, `startTime`)}
            className="w-full"
            outlined={true}
            {...register(`startTime`, {
              required: tCommon('required'),
            })}
          />
        ) : null}
        <TextInput
          type="date"
          className="w-full"
          outlined={true}
          error={_.get(errors, `endDate`)}
          {...register(`endDate`, {
            required: tCommon('required'),
          })}
        />
        {!isAllDay ? (
          <TextInput
            type="time"
            className="w-full"
            outlined={true}
            error={_.get(errors, `endTime`)}
            {...register(`endTime`, {
              required: tCommon('required'),
            })}
          />
        ) : null}
        <Checkbox
          label={t('all_day')}
          color="secondary"
          checked={watch('isAllDay')}
          onChange={(e) => setValue('isAllDay', e.target.checked)}
        />
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

        {isNew ? (
          <Button color="primary" className="mt-4">
            {t('save')}
          </Button>
        ) : null}
        {!isNew ? (
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

CalendarSimpleEventModal.propTypes = {
  event: PropTypes.object,
  calendars: PropTypes.array,
  eventTypes: PropTypes.array,
  close: PropTypes.func,
  config: PropTypes.object,
};

export const useCalendarSimpleEventModal = () => {
  const [drawer, setDrawer] = useState(false);

  return [
    () => setDrawer((d) => !d),
    (data) => (
      <Drawer opened={drawer}>
        <CalendarSimpleEventModal {...data} />
      </Drawer>
    ),
  ];
};

export default useCalendarSimpleEventModal;
