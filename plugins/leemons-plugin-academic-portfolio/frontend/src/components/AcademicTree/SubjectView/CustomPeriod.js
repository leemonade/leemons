import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { useAcademicCalendarConfig, useCustomPeriodsByItem } from '@academic-calendar/hooks';
import { Text, Alert, Stack, Switch, DatePicker, Box } from '@bubbles-ui/components';
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

  const { data: academicCalendars } = useAcademicCalendarConfig(programId, {
    enabled: !!programId && parentPeriod?.academicKey === 'course',
  });
  const [{ data: academicCalendar }] = academicCalendars || [{ data: null }];
  const { data: parentCustomPeriod } = useCustomPeriodsByItem(parentPeriod.id, {
    enabled: !!parentPeriod.id && parentPeriod?.academicKey === 'subject',
  });

  const parentPeriodDates = useMemo(() => {
    if (academicKey === 'subject') {
      if (!academicCalendar?.courseDates) return null;
      return academicCalendar.courseDates[parentPeriod.id];
    }
    if (academicKey === 'class') {
      return parentCustomPeriod?.startDate && parentCustomPeriod?.endDate
        ? { startDate: parentCustomPeriod.startDate, endDate: parentCustomPeriod.endDate }
        : null;
    }
    return null;
  }, [parentPeriod, academicCalendar, parentCustomPeriod, academicKey]);

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

  if (tLoading) return null;
  return (
    <Box>
      <Box>
        <Text strong>{t('title')}</Text>
      </Box>
      <Stack direction="column" spacing={2}>
        <Switch
          label={t('label')}
          checked={hasCustomPeriod}
          onChange={(value) => handleSwitchChange(value)}
        />
        {hasCustomPeriod && (
          <>
            <Alert variant="info" closeable={false}>
              <Stack spacing={2}>
                {parentPeriodDates?.startDate && parentPeriodDates?.endDate ? (
                  <>
                    <Text>{t('info.currentPeriod')}</Text>
                    <LocaleDate date={parentPeriodDates?.startDate} />
                    <Text>→</Text>
                    <LocaleDate date={parentPeriodDates?.endDate} />
                  </>
                ) : (
                  <Text>{t('info.noPeriod')}</Text>
                )}
              </Stack>
            </Alert>

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
                    maxDate={customEndDate}
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
                    maxDate={customEndDate}
                    locale={locale}
                    label={t('endDate')}
                    minDate={customStartDate}
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
      </Stack>
    </Box>
  );
}

CustomPeriod.propTypes = {
  programId: PropTypes.string,
  parentPeriod: PropTypes.shape({
    academicKey: PropTypes.string, // 'course' or 'subject'
    id: PropTypes.string,
  }),
  childrenPeriods: PropTypes.array,
  customPeriod: PropTypes.object,
  onChange: PropTypes.func,
  academicKey: PropTypes.oneOf(['subject', 'class']),
};

export default CustomPeriod;
