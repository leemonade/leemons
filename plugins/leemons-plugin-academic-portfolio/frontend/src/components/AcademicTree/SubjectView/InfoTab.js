import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { useAcademicCalendarConfig } from '@academic-calendar/hooks';
import {
  Box,
  Text,
  Alert,
  Paper,
  Stack,
  Title,
  Loader,
  Switch,
  DatePicker,
  ImageLoader,
  ContextContainer,
} from '@bubbles-ui/components';
import { useLocale } from '@common';
import { LocaleDate } from '@common/LocaleDate';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isArray, get } from 'lodash';
import PropTypes from 'prop-types';

import prefixPN from '@academic-portfolio/helpers/prefixPN';

const InfoTab = ({ subjectDetails, onlyClassToShow, updateForm, setDirtyForm }) => {
  const [t] = useTranslateLoader(prefixPN('tree_page'));
  const { t: tCommon } = useCommonTranslate('forms');
  const locale = useLocale();
  const [hasCustomPeriod, setHasCustomPeriod] = useState(!!subjectDetails?.customPeriod);

  const localForm = useForm();
  const form = updateForm ?? localForm;

  const academicCalendars = useAcademicCalendarConfig([subjectDetails?.program], {
    enabled: !!subjectDetails?.program,
  });

  const [{ data: academicCalendar }] = academicCalendars ?? [{ data: null }];

  // console.log('programDetails', programDetails);
  console.log('subjectDetails', subjectDetails);
  console.log('academicCalendar', academicCalendar);

  const courseDates = useMemo(() => {
    if (!academicCalendar?.courseDates || !subjectDetails?.classes?.length) return null;

    let [course] = subjectDetails.courses ?? [];

    if (!course) {
      const { courses } = subjectDetails.classes[0] ?? {};
      if (isArray(courses)) {
        course = courses[0].id;
      } else {
        course = courses.id;
      }
    }

    return academicCalendar.courseDates[course];
  }, [subjectDetails, academicCalendar]);

  console.log('courseDates', courseDates);

  const customStartDate = form.watch('customPeriod.startDate');
  const customEndDate = form.watch('customPeriod.endDate');
  const formErrors = form.formState.errors;

  const subjectHeaderData = useMemo(() => {
    const subjectData = {};
    const courses = isArray(subjectDetails?.classes[0]?.courses)
      ? subjectDetails?.classes[0]?.courses.map((crs) => `${crs.index}º`).join(', ')
      : `${subjectDetails?.classes[0]?.courses?.index}º`;

    subjectData.courses = courses;

    let groups = subjectDetails?.classes
      ?.map((cls) => cls.groups?.name)
      .filter((name) => name !== null && name !== undefined);

    if (groups?.length === 0) {
      groups = null;
    } else {
      groups = groups?.sort().join(', ');
    }
    subjectData.groups = groups;

    const knowledgeAreas = subjectDetails?.classes[0]?.knowledges?.name;
    subjectData.knowledgeAreas = knowledgeAreas;

    const subjectType = subjectDetails?.classes[0]?.subjectType?.name;
    subjectData.subjectType = subjectType;

    const credits = subjectDetails?.credits;
    subjectData.credits = credits;

    return subjectData;
  }, [subjectDetails, onlyClassToShow]);

  useEffect(() => {
    setHasCustomPeriod(!!subjectDetails?.customPeriod);
  }, [subjectDetails]);

  const subjectIcon = getFileUrl(subjectDetails?.icon?.cover?.id);
  const cover = getFileUrl(subjectDetails?.image?.cover?.id);

  if (!subjectDetails) {
    return (
      <Stack fullHeight>
        <Loader padded={true} />
      </Stack>
    );
  }

  return (
    <ContextContainer sx={{ padding: 24 }}>
      <ContextContainer>
        <Title order={2}>{t('basicDataTitle')}</Title>
        <Stack spacing={4}>
          {subjectDetails?.internalId && (
            <Box>
              <Text strong>{`${t('idLabel')}: `}</Text>
              <Text>{subjectDetails?.internalId}</Text>
            </Box>
          )}
          <Box>
            <Text strong>{`${t('courseLabel')}: `}</Text>
            <Text>{subjectHeaderData?.courses}</Text>
          </Box>
          {subjectHeaderData?.groups && (
            <Box>
              <Text strong>{`${t('groupLabel')}: `}</Text>
              <Text>{subjectHeaderData?.groups}</Text>
            </Box>
          )}
          {subjectHeaderData?.knowledgeAreas && (
            <Box>
              <Text strong>{`${t('knowledgeLabel')}: `}</Text>
              <Text>{subjectHeaderData?.knowledgeAreas}</Text>
            </Box>
          )}
          {subjectHeaderData?.subjectType?.length && (
            <Box>
              <Text strong>{`${t('subjectTypeLabel')}: `}</Text>
              <Text>{subjectHeaderData?.subjectType}</Text>
            </Box>
          )}
          {subjectDetails?.credits && (
            <Box>
              <Text strong>{`${t('creditsLabel')}: `}</Text>
              <Text>{subjectDetails?.credits}</Text>
            </Box>
          )}
        </Stack>
        <Box>
          <Box>
            <Text strong>{t('subject.customPeriod.title')}</Text>
          </Box>
          <Stack direction="column" spacing={2}>
            <Switch
              label={t('subject.customPeriod.label')}
              checked={hasCustomPeriod}
              onChange={() => setHasCustomPeriod(!hasCustomPeriod)}
            />
            {hasCustomPeriod && (
              <>
                <Alert variant="info" closeable={false}>
                  <Stack spacing={2}>
                    <Text>{t('subject.customPeriod.info')}</Text>
                    <LocaleDate date={courseDates?.startDate} />
                    <Text>→</Text>
                    <LocaleDate date={courseDates?.endDate} />
                  </Stack>
                </Alert>
                <Stack spacing={4}>
                  <Controller
                    name={`customPeriod.startDate`}
                    control={form.control}
                    rules={{ required: tCommon('required') }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        value={customStartDate}
                        locale={locale}
                        label={t('subject.customPeriod.startDate')}
                        maxDate={customEndDate}
                        required
                        error={get(formErrors, `customPeriod.startDate`)}
                        onChange={(value) => {
                          if (!value) {
                            form.setValue('customPeriod.endDate', null);
                          }
                          field.onChange(value);
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={`customPeriod.endDate`}
                    control={form.control}
                    rules={{ required: tCommon('required') }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        clearable={false}
                        value={customEndDate}
                        locale={locale}
                        label={t('subject.customPeriod.endDate')}
                        minDate={customStartDate}
                        disabled={!customStartDate}
                        required
                        error={get(formErrors, `customPeriod.endDate`)}
                      />
                    )}
                  />
                </Stack>
              </>
            )}
          </Stack>
        </Box>
      </ContextContainer>

      {subjectIcon && (
        <ContextContainer>
          <Title>{t('icon')}</Title>
          <Text>{t('iconDescription')}</Text>
          <Stack>
            <Paper
              shadow="none"
              bordered
              style={{
                minWidth: 282,
                maxHeight: 108,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box style={{ display: 'flex', justifyContent: 'center' }}>
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: subjectDetails?.color,
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                  }}
                >
                  <ImageLoader src={subjectIcon} width={32} height={32} />
                </Box>
              </Box>
              <Text strong style={{ marginTop: 6 }}>
                {subjectDetails?.name}
              </Text>
            </Paper>
          </Stack>
        </ContextContainer>
      )}

      {cover && (
        <ContextContainer>
          <Title>{t('image')}</Title>
          <Text>{t('image')}</Text>
          <Stack>
            <Box
              style={{
                borderRadius: 12,
                backgroundImage: `url(${cover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: 282,
                height: 108,
              }}
            >
              {/* <ImageLoader src={cover} width={282} height={108} /> */}
            </Box>
          </Stack>
        </ContextContainer>
      )}
    </ContextContainer>
  );
};

InfoTab.propTypes = {
  subjectDetails: PropTypes.object,
  onlyClassToShow: PropTypes.oneOfType([PropTypes.object, PropTypes.null]),
  updateForm: PropTypes.func,
  setDirtyForm: PropTypes.func,
};

export default InfoTab;
