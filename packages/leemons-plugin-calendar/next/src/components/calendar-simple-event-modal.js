import * as _ from 'lodash';
import { useEffect, useState } from 'react';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { Button, Checkbox, Drawer, FormControl, Input, Radio, Select, useDrawer } from 'leemons-ui';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@calendar/helpers/prefixPN';
import { useForm } from 'react-hook-form';
import tKeys from '@multilanguage/helpers/tKeys';
import PropTypes from 'prop-types';

function CalendarSimpleEventModal({ event, eventTypes, save, remove, close }) {
  const [t] = useTranslateLoader(prefixPN('event_modal'));
  const { t: tCommon } = useCommonTranslate('forms');
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [isNew, setIsNew] = useState(true);
  const [eventTypesT, setEventTypesT] = useState([]);

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

      const sdIsoArr = _startDate.toISOString().split('T');
      setValue('startDate', sdIsoArr[0]);
      setValue('startTime', sdIsoArr[1].split('.')[0]);

      const edIsoArr = _endDate.toISOString().split('T');
      setValue('endDate', edIsoArr[0]);
      setValue('endTime', edIsoArr[1].split('.')[0]);
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

    save({
      startDate: getUTCString(startDate),
      endDate: getUTCString(endDate),
      ...formData,
    });
    close();
  };

  const removeEvent = async () => {
    remove(event);
    close();
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
  close: PropTypes.func.isRequired,
  eventTypes: PropTypes.any.isRequired,
  save: PropTypes.func,
  remove: PropTypes.func,
};

export const useCalendarSimpleEventModal = () => {
  const [drawer, toggleDrawer] = useDrawer({
    animated: true,
    side: 'right',
  });

  return [
    toggleDrawer,
    function (data) {
      return (
        <Drawer {...drawer}>
          <CalendarSimpleEventModal {...data} />
        </Drawer>
      );
    },
  ];
};
