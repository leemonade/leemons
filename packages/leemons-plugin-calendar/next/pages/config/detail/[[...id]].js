import * as _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';
import { useForm } from 'react-hook-form';
import { useAsync } from '@common/useAsync';
import { useRouter } from 'next/router';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import {
  addCalendarConfigRequest,
  detailCalendarConfigsRequest,
  getCentersWithOutAssignRequest,
  removeCalendarConfigRequest,
  updateCalendarConfigsRequest,
} from '@calendar/request';
import prefixPN from '@calendar/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { Badge, FormControl, PageContainer, PageHeader, Radio, Select } from 'leemons-ui';
import { addErrorAlert } from '@layout/alert';
import countryList from 'country-region-data';

function ConfigAdd() {
  useSession({ redirectTo: goLoginPage });

  const weekdays = useMemo(
    () => [
      { value: 1, name: 'monday' },
      { value: 2, name: 'tuesday' },
      { value: 3, name: 'wednesday' },
      { value: 4, name: 'thursday' },
      { value: 5, name: 'friday' },
      { value: 6, name: 'saturday' },
      { value: 0, name: 'sunday' },
    ],
    []
  );

  const months = useMemo(
    () => [
      { value: 1, name: 'january' },
      { value: 2, name: 'february' },
      { value: 3, name: 'march' },
      { value: 4, name: 'april' },
      { value: 5, name: 'may' },
      { value: 6, name: 'june' },
      { value: 7, name: 'july' },
      { value: 8, name: 'august' },
      { value: 9, name: 'september' },
      { value: 10, name: 'october' },
      { value: 11, name: 'november' },
      { value: 12, name: 'december' },
    ],
    []
  );

  const years = useMemo(() => {
    const currentYear = new Date().getUTCFullYear();
    const minYear = currentYear - 100;
    const maxYear = currentYear + 100;
    const list = [];
    for (let i = minYear; i <= maxYear; i++) {
      list.push(i);
    }
    return list;
  }, []);

  const [t] = useTranslateLoader(prefixPN('detail_page'));
  const { t: tCommonHeader } = useCommonTranslate('page_header');
  const { t: tCommonForm } = useCommonTranslate('forms');

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [data, setData] = useState(null);
  const [centers, setCenters] = useState(null);
  const [regionList, setRegionList] = useState(null);

  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const load = useCallback(async () => {
    setLoading(true);
    reset();
    if (router.isReady && router.query && _.isArray(router.query.id)) {
      const id = router.query.id[0];
      let config = null;
      if (id !== 'new') {
        const response = await detailCalendarConfigsRequest(id);
        config = response.config;
      }
      const { centers: _centers } = await getCentersWithOutAssignRequest();
      return { config, _centers };
    }
    return null;
  }, [router]);

  const onSuccess = useCallback((_data) => {
    if (_data) {
      const { config, _centers } = _data;
      if (config) {
        setData(config);
        const {
          id,
          // eslint-disable-next-line camelcase
          created_at,
          // eslint-disable-next-line camelcase
          updated_at,
          countryShortCode,
          countryName,
          regionShortCode,
          regionName,
          startMonth,
          startYear,
          endMonth,
          endYear,
          centers: __centers,
          ...values
        } = config;
        setCenters([..._centers, ...__centers]);
        _.forIn(values, (value, key) => {
          setValue(key, value);
        });
        setValue('centers', _.map(__centers, 'id'));
        setValue('startMonth', startMonth.toString());
        setValue('startYear', startYear.toString());
        setValue('endMonth', endMonth.toString());
        setValue('endYear', endYear.toString());
        setValue('country', countryShortCode);
        setTimeout(() => setValue('region', regionShortCode), 100);
      } else {
        setValue('addedFrom', 'scratch');
        setValue('country', '_');
        setValue('region', '_');
        setValue('startMonth', '_');
        setValue('startYear', '_');
        setValue('endMonth', '_');
        setValue('endYear', '_');
        setValue('weekday', '_');
        setValue('notSchoolDays', [6, 0]);
        setValue('schoolDays', [1, 2, 3, 4, 5]);
        setValue('centers', []);
        setCenters(_centers);
      }
      setLoading(false);
    }
  }, []);

  const onError = useCallback((e) => {
    // ES: 4001 codigo de que aun no existe schema, como es posible ignoramos el error
    if (e.code !== 4001) {
      setError(e);
    }
    setLoading(false);
  }, []);

  useAsync(load, onSuccess, onError, [router]);

  useEffect(() => {
    const subscription = watch(({ country }, { name }) => {
      if (name === 'country') {
        if (country && country !== '_') {
          setRegionList(_.find(countryList, { countryShortCode: country }).regions);
          setValue('region', '_');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const toggleSchoolDay = (day) => {
    const schoolDays = getValues('schoolDays');
    const notSchoolDays = getValues('notSchoolDays');
    const schoolDayIndex = schoolDays.indexOf(day);
    if (schoolDayIndex >= 0) {
      schoolDays.splice(schoolDayIndex, 1);
      notSchoolDays.push(day);
    } else {
      schoolDays.push(day);
      notSchoolDays.splice(notSchoolDays.indexOf(day), 1);
    }
    setValue('schoolDays', schoolDays);
    setValue('notSchoolDays', notSchoolDays);
  };

  const onDeleteButton = async () => {
    try {
      // Todo: Añadir modal de asegurar borrado
      await removeCalendarConfigRequest(data.id);
      await router.push('/calendar/config/');
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  const onSubmit = async ({ country, region, ...formData }) => {
    try {
      let config;

      const countryItem = _.find(countryList, { countryShortCode: country });
      const regionItem = _.find(countryItem.regions, { shortCode: region });

      const toSend = {
        ...formData,
        countryName: countryItem.countryName,
        countryShortCode: countryItem.countryShortCode,
        regionName: regionItem.name,
        regionShortCode: regionItem.shortCode,
        weekday: parseInt(formData.weekday, 10),
        startMonth: parseInt(formData.startMonth, 10),
        startYear: parseInt(formData.startYear, 10),
        endMonth: parseInt(formData.endMonth, 10),
        endYear: parseInt(formData.endYear, 10),
      };

      if (!toSend.description) {
        delete toSend.description;
      }

      setSaveLoading(true);
      if (data) {
        const response = await updateCalendarConfigsRequest(data.id, toSend);
        config = response.config;
      } else {
        const response = await addCalendarConfigRequest(toSend);
        config = response.config;
      }
      setSaveLoading(false);
      await router.push(`/calendar/config/detail/${config.id}`);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
  };

  const formAddedFrom = watch('addedFrom');
  const formSchoolDays = watch('schoolDays');

  return (
    <>
      {!error && !loading ? (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <PageHeader
              registerFormTitle={register('title', { required: tCommonForm('required') })}
              registerFormTitleErrors={errors.title}
              titlePlaceholder={t('title_placeholder')}
              title={watch('title')}
              description={t('title_description')}
              saveButton={tCommonHeader('save')}
              saveButtonLoading={saveLoading}
              cancelButton={data?.id ? tCommonHeader('delete') : null}
              onCancelButton={onDeleteButton}
            />
            <div className="bg-primary-content">
              <PageContainer>
                <div className="page-description max-w-screen-sm">{t('description')}</div>
                {!data ? (
                  <>
                    <div className="mt-4">
                      <FormControl label={t('add_calendar')} />
                      <div className="flex gap-4">
                        <FormControl label={t('from_market')} labelPosition="right">
                          <Radio
                            color={_.get(errors, `addedFrom`) ? 'error' : 'primary'}
                            name="addedFrom"
                            checked={formAddedFrom === 'market'}
                            onChange={() => setValue('addedFrom', 'market')}
                            value={'market'}
                          />
                        </FormControl>
                        <FormControl label={t('from_scratch')} labelPosition="right">
                          <Radio
                            color={_.get(errors, `addedFrom`) ? 'error' : 'primary'}
                            name="addedFrom"
                            checked={formAddedFrom === 'scratch'}
                            onChange={() => setValue('addedFrom', 'scratch')}
                            value={'scratch'}
                          />
                        </FormControl>
                      </div>
                    </div>
                  </>
                ) : null}

                {/* Centers */}
                <FormControl label={t('centers')} formError={_.get(errors, 'centers')}>
                  <Select
                    outlined
                    multiple={true}
                    value={watch('centers')}
                    onChange={(e) => setValue('centers', e)}
                    placeholderLabel={t('centers_placeholder')}
                  >
                    {centers
                      ? centers.map((center) => (
                          <option key={center.id} value={center.id}>
                            {center.name}
                          </option>
                        ))
                      : null}
                  </Select>
                </FormControl>

                {/* Country/Region */}
                <div className="flex gap-4">
                  <FormControl label={t('country')} formError={_.get(errors, 'country')}>
                    <Select
                      outlined
                      {...register(`country`, {
                        required: tCommonForm('required'),
                        minLength: {
                          value: 2,
                          message: tCommonForm('required'),
                        },
                      })}
                      value={watch('country')}
                    >
                      <option value="_" disabled>
                        {t('country_placeholder')}
                      </option>
                      {countryList.map((country) => (
                        <option key={country.countryShortCode} value={country.countryShortCode}>
                          {country.countryName}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl label={t('region')} formError={_.get(errors, 'region')}>
                    <Select
                      outlined
                      disabled={!regionList}
                      {...register(`region`, {
                        required: tCommonForm('required'),
                        minLength: {
                          value: 2,
                          message: tCommonForm('required'),
                        },
                      })}
                      value={watch('region')}
                    >
                      <option value="_" disabled>
                        {t('region_placeholder')}
                      </option>

                      {regionList
                        ? regionList.map((region) => (
                            <option key={region.shortCode} value={region.shortCode}>
                              {region.name}
                            </option>
                          ))
                        : null}
                    </Select>
                  </FormControl>
                </div>

                {/* Start/End */}
                <div className="flex gap-4">
                  {/* Start */}
                  <div>
                    <FormControl label={t('starts')} />
                    <div className="flex gap-4">
                      <FormControl formError={_.get(errors, 'startMonth')}>
                        <Select
                          outlined
                          {...register(`startMonth`, {
                            required: tCommonForm('required'),
                            validate: (value) => (value === '_' ? tCommonForm('required') : true),
                          })}
                          value={watch('startMonth')}
                        >
                          <option value="_" disabled>
                            {t('month_placeholder')}
                          </option>
                          {months.map((month) => (
                            <option key={month.value} value={month.value.toString()}>
                              {t(month.name)}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl formError={_.get(errors, 'startYear')}>
                        <Select
                          outlined
                          {...register(`startYear`, {
                            required: tCommonForm('required'),
                            validate: (value) => (value === '_' ? tCommonForm('required') : true),
                          })}
                          value={watch('startYear')}
                        >
                          <option value="_" disabled>
                            {t('year_placeholder')}
                          </option>
                          {years.map((year) => (
                            <option key={year} value={year.toString()}>
                              {year}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  {/* End */}
                  <div>
                    <FormControl label={t('ends')} />
                    <div className="flex gap-4">
                      <FormControl formError={_.get(errors, 'endMonth')}>
                        <Select
                          outlined
                          {...register(`endMonth`, {
                            required: tCommonForm('required'),
                            validate: (value) => (value === '_' ? tCommonForm('required') : true),
                          })}
                          value={watch('endMonth')}
                        >
                          <option value="_" disabled>
                            {t('month_placeholder')}
                          </option>
                          {months.map((month) => (
                            <option key={month.value} value={month.value.toString()}>
                              {t(month.name)}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl formError={_.get(errors, 'endYear')}>
                        <Select
                          outlined
                          {...register(`endYear`, {
                            required: tCommonForm('required'),
                            validate: (value) => (value === '_' ? tCommonForm('required') : true),
                          })}
                          value={watch('endYear')}
                        >
                          <option value="_" disabled>
                            {t('year_placeholder')}
                          </option>
                          {years.map((year) => (
                            <option key={year} value={year.toString()}>
                              {year}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>

                {/* First day of week */}
                <FormControl label={t('first_day_week')} formError={_.get(errors, 'weekday')}>
                  <Select
                    outlined
                    {...register(`weekday`, {
                      required: tCommonForm('required'),
                      validate: (value) => (value === '_' ? tCommonForm('required') : true),
                    })}
                    value={watch('weekday')}
                  >
                    <option value="_" disabled>
                      {t('first_day_week_placeholder')}
                    </option>
                    {weekdays.map((day) => (
                      <option key={day.value} value={day.value}>
                        {t(day.name)}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                {/* School days */}
                <FormControl label={t('school_and_non_school_days')} />
                <div className="page-description max-w-screen-sm">
                  {t('school_and_non_school_days_description')}
                </div>
                <div className="mt-4">
                  {weekdays.map((day) => (
                    <Badge
                      key={day.value}
                      color={formSchoolDays.indexOf(day.value) >= 0 ? 'primary' : undefined}
                      onClick={() => toggleSchoolDay(day.value)}
                      className="cursor-pointer"
                    >
                      {t(day.name)}
                    </Badge>
                  ))}
                </div>
              </PageContainer>
            </div>
          </form>
        </>
      ) : (
        <ErrorAlert />
      )}
    </>
  );
}

export default withLayout(ConfigAdd);
