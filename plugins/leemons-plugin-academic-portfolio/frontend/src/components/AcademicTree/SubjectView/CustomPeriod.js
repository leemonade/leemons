import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { useAcademicCalendarConfig, useCustomPeriodsByItem } from '@academic-calendar/hooks';
import {
  Text,
  Alert,
  Stack,
  Switch,
  DatePicker,
  Box,
  Loader,
  Anchor,
} from '@bubbles-ui/components';
import { useLocale } from '@common';
import { LocaleDate } from '@common/LocaleDate';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { get } from 'lodash';
import PropTypes from 'prop-types';

import prefixPN from '@academic-portfolio/helpers/prefixPN';

const ensureDate = (date) => {
  if (!date) return null;
  return date instanceof Date ? date : new Date(date);
};

function CustomPeriod({
  programId,
  courseId,
  parentPeriod,
  childrenPeriods,
  customPeriod,
  onChange,
  academicKey = 'subject',
}) {
  const [t, , , tLoading] = useTranslateLoader(prefixPN(`tree_page.${academicKey}.customPeriod`));
  const [hasCustomPeriod, setHasCustomPeriod] = useState(!!customPeriod);

  const { t: tCommon } = useCommonTranslate('forms');
  const locale = useLocale();

  const form = useForm({
    defaultValues: {
      startDate: ensureDate(customPeriod?.startDate),
      endDate: ensureDate(customPeriod?.endDate),
    },
  });

  const { data: academicCalendar, isLoading: academicCalendarLoading } = useAcademicCalendarConfig(
    programId,
    {
      enabled: !!programId,
    }
  );

  const { data: parentCustomPeriod } = useCustomPeriodsByItem(parentPeriod, {
    enabled: !!parentPeriod,
  });

  const courseDates = useMemo(() => {
    if (!academicCalendar?.courseDates) return null;
    return academicCalendar.courseDates[courseId];
  }, [academicCalendar, courseId]);

  const parentPeriodDates = useMemo(() => {
    if (parentCustomPeriod) {
      return parentCustomPeriod?.startDate && parentCustomPeriod?.endDate
        ? { startDate: parentCustomPeriod.startDate, endDate: parentCustomPeriod.endDate }
        : null;
    }
    return null;
  }, [parentCustomPeriod]);

  const childrenHaveDifferentPeriods = useMemo(() => {
    if (academicKey === 'subject' && childrenPeriods?.length) {
      if (!customPeriod) {
        return childrenPeriods.some((childPeriod) => childPeriod.startDate || childPeriod.endDate);
      }

      return childrenPeriods.some(
        (childPeriod) =>
          childPeriod.startDate !== customPeriod.startDate ||
          childPeriod.endDate !== customPeriod.endDate
      );
    }
    return false;
  }, [childrenPeriods, customPeriod, academicKey]);

  const customStartDate = form.watch('startDate');
  const customEndDate = form.watch('endDate');
  const formErrors = form.formState.errors;

  useEffect(() => {
    setHasCustomPeriod(!!customPeriod);
    if (customPeriod) {
      form.setValue('startDate', customPeriod.startDate);
      form.setValue('endDate', customPeriod.endDate);
    }
  }, [customPeriod, form]);

  const validateValuesChange = useCallback(
    (startDate, endDate) => {
      let areValuesValid = !!(startDate && endDate);
      let areValuesDifferent =
        startDate !== customPeriod?.startDate || endDate !== customPeriod?.endDate;

      if (!customPeriod && !startDate && !endDate) areValuesDifferent = false;
      if (customPeriod && !startDate && !endDate) areValuesValid = true;

      if (startDate && !endDate) {
        form.setError('endDate', { type: 'manual', message: tCommon('required') });
      }
      if (!startDate && endDate) {
        form.setError('startDate', { type: 'manual', message: tCommon('required') });
      }

      if (areValuesValid || !startDate) {
        form.clearErrors();
      }

      return { areValuesValid, areValuesDifferent };
    },
    [customPeriod, form, tCommon]
  );

  const handleOnChange = () => {
    const formValues = form.getValues();
    const { areValuesValid, areValuesDifferent } = validateValuesChange(
      formValues.startDate,
      formValues.endDate
    );

    onChange({
      value: areValuesDifferent ? formValues : undefined,
      areValuesValid,
      areValuesDifferent,
    });
  };

  const handleSwitchChange = (value) => {
    if (!value) {
      form.setValue('startDate', null);
      form.setValue('endDate', null);
    } else {
      form.setValue('startDate', customPeriod?.startDate ?? null);
      form.setValue('endDate', customPeriod?.endDate ?? null);
    }
    setHasCustomPeriod(value);
    handleOnChange();
  };

  const ParentPeriodInfoAlert = useMemo(() => {
    const entitiesWithParentPeriods = ['class'];
    if (!entitiesWithParentPeriods.includes(academicKey)) return null;

    if (parentPeriodDates?.startDate && parentPeriodDates?.endDate) {
      return (
        <Alert variant="info" closeable={false}>
          <Stack spacing={2}>
            <Text>{t('info.parentPeriod')}</Text>
            <LocaleDate date={parentPeriodDates?.startDate} />
            <Text>→</Text>
            <LocaleDate date={parentPeriodDates?.endDate} />
          </Stack>
        </Alert>
      );
    }

    return (
      <Alert variant="info" closeable={false}>
        <Text>{t('info.noParentPeriod')}</Text>
      </Alert>
    );
  }, [parentPeriodDates, academicKey, t]);

  if (tLoading || (programId && academicCalendarLoading))
    return (
      <Stack sx={{ width: 192 }}>
        <Loader padded />
      </Stack>
    );
  return (
    <Box>
      <Stack direction="column" spacing={2}>
        <Box>
          <Text strong>{t('title')}</Text>
        </Box>
        {courseDates ? (
          <>
            <Switch
              label={t('label')}
              checked={hasCustomPeriod}
              onChange={(value) => handleSwitchChange(value)}
            />
            {hasCustomPeriod && (
              <>
                <Alert variant="info" closeable={false}>
                  <Stack spacing={2}>
                    <>
                      <Text>{t('info.academicPeriod')}</Text>
                      <LocaleDate date={courseDates?.startDate} />
                      <Text>→</Text>
                      <LocaleDate date={courseDates?.endDate} />
                    </>
                  </Stack>
                </Alert>

                {ParentPeriodInfoAlert}

                {childrenHaveDifferentPeriods && (
                  <Alert variant="info" closeable={false}>
                    <Text>{t('info.childrenDifferentPeriods')}</Text>
                  </Alert>
                )}

                <Stack spacing={4}>
                  <Controller
                    name={`startDate`}
                    control={form.control}
                    rules={{ required: tCommon('required') }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={ensureDate(field.value)}
                        locale={locale}
                        label={t('startDate')}
                        minDate={ensureDate(courseDates?.startDate)}
                        maxDate={
                          customEndDate
                            ? Math.min(new Date(customEndDate), new Date(courseDates?.endDate))
                            : ensureDate(courseDates?.endDate)
                        }
                        required
                        error={get(formErrors, `startDate`)}
                        onChange={(value) => {
                          if (!value) {
                            form.setValue('endDate', null);
                          }
                          field.onChange(value);
                          handleOnChange();
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={`endDate`}
                    control={form.control}
                    rules={{ required: tCommon('required') }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={ensureDate(field.value)}
                        minDate={ensureDate(customStartDate || courseDates?.startDate)}
                        maxDate={ensureDate(courseDates?.endDate)}
                        locale={locale}
                        label={t('endDate')}
                        onChange={(value) => {
                          if (!value) {
                            form.setValue('endDate', null);
                          }
                          field.onChange(value);
                          handleOnChange();
                        }}
                        disabled={!customStartDate}
                        required
                        error={get(formErrors, `endDate`)}
                      />
                    )}
                  />
                </Stack>
              </>
            )}
          </>
        ) : (
          <Alert variant="info" closeable={false}>
            <Stack spacing={1}>
              <Text>{`${t('info.noAcademicPeriod')}`}</Text>
              <Anchor href={'/private/academic-calendar/program-calendars'}>
                {t('defineAcademicPeriod')}
              </Anchor>
            </Stack>
          </Alert>
        )}
      </Stack>
    </Box>
  );
}

CustomPeriod.propTypes = {
  programId: PropTypes.string,
  courseId: PropTypes.string,
  parentPeriod: PropTypes.object,
  childrenPeriods: PropTypes.array,
  customPeriod: PropTypes.object,
  onChange: PropTypes.func,
  academicKey: PropTypes.oneOf(['subject', 'class']),
};

export default CustomPeriod;
