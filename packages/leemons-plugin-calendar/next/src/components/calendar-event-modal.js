import * as _ from 'lodash';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Drawer, FormControl, Input, Radio, Select, useDrawer } from 'leemons-ui';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { getLocalizationsByArrayOfItems } from '@multilanguage/useTranslate';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '@calendar/helpers/prefixPN';
import { useForm } from 'react-hook-form';
import tKeys from '@multilanguage/helpers/tKeys';
import PropTypes from 'prop-types';
import { dynamicImport } from '@common/dynamicImport';
import { getEventTypesRequest } from '../request';

function CalendarEventModal({ event }) {
  const [t] = useTranslateLoader(prefixPN('event_modal'));
  const { t: tCommon } = useCommonTranslate('forms');
  const [eventTypes, setEventTypes] = useState([]);
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

  const getEventTypes = async () => {
    const response = await getEventTypesRequest();
    setEventTypes(response.eventTypes);
  };

  const getEventTypeTranslations = async () => {
    const { items } = await getLocalizationsByArrayOfItems(_.map(eventTypes, 'key'));
    setEventTypesT(items);
  };

  const getEventTypeName = (sectionName) => tKeys(sectionName, eventTypesT);

  const onSubmit = async (formData) => {
    console.log(formData);
  };

  const init = async () => {
    await getEventTypes();
    if (event) {
      const { startDate, endDate, isAllDay, ...eventData } = event;
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
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    getEventTypeTranslations();
  }, [eventTypes]);

  register(`isAllDay`);

  let EventTypeSection = null;
  const formType = watch('type');
  if (formType) {
    const eventType = _.find(eventTypes, { key: formType });
    if (eventType) {
      EventTypeSection = dynamicImport(eventType.url);
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

        {eventTypes.map((eventType, index) => (
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

        <FormControl label={t('all_day')}>
          <Checkbox
            color="secondary"
            labelPosition="right"
            checked={watch('isAllDay')}
            onChange={(e) => setValue('isAllDay', e.target.checked)}
          />
        </FormControl>

        {EventTypeSection ? <EventTypeSection /> : null}

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

        <Button color="primary" className="mt-4">
          {t('save')}
        </Button>
      </form>
    </div>
  );
}

CalendarEventModal.propTypes = {
  event: PropTypes.object,
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
