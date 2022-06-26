import React from 'react';
import PropTypes from 'prop-types';
import { forEach, get, map } from 'lodash';
import {
  Box,
  Button,
  Col,
  ContextContainer,
  DatePicker,
  Grid,
  InputWrapper,
  LoadingOverlay,
  MultiSelect,
  Stack,
  Switch,
  TableInput,
  TextInput,
  TimeInput,
  Title,
} from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import prefixPN from '@academic-calendar/helpers/prefixPN';
import { useStore } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { getConfigRequest, saveConfigRequest } from '@academic-calendar/request';
import { Controller, useForm } from 'react-hook-form';
import { detailProgram } from '@academic-portfolio/request/programs';
import getCourseName from '@academic-portfolio/helpers/getCourseName';

export default function AcademicCalendarDetail({ program: { id } }) {
  const [t, , , loading] = useTranslateLoader(prefixPN('configDetail'));
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const [store, render] = useStore({
    loading: true,
  });

  const form = useForm();
  const formErrors = form.formState.errors;
  const allCoursesHaveSameConfig = form.watch('allCoursesHaveSameConfig');
  const allCoursesHaveSameDates = form.watch('allCoursesHaveSameDates');

  const coursesForDates = allCoursesHaveSameDates
    ? [store.program?.courses[0]]
    : store.program?.courses;

  const columns = [];
  columns.push({
    Header: t('name'),
    accessor: 'name',
    input: {
      node: <TextInput required />,
      rules: { required: t('fieldRequired') },
    },
  });

  if (store.program && !store.program.moreThanOneAcademicYear && store.program.courses.length > 1) {
    const courseData = map(store.program.courses, (course) => ({
      label: getCourseName(course),
      value: course.id,
    }));
    columns.push({
      Header: t('course'),
      accessor: 'courses',
      input: {
        node: <MultiSelect data={courseData} />,
        rules: { required: t('fieldRequired') },
      },
      valueRender: (value) => {
        if (value.length === courseData.length) {
          return t('allCourses');
        }
        return <MultiSelect readOnly data={courseData} value={value} />;
      },
    });
  }

  columns.push({
    Header: t('from'),
    accessor: 'startDate',
    input: {
      node: <TimeInput required />,
      rules: { required: t('fieldRequired') },
    },
    valueRender: (value) => {
      const hours = new Date(value).getHours();
      const minutes = new Date(value).getMinutes();
      return `${hours > 9 ? '' : '0'}${hours}:${minutes > 9 ? '' : '0'}${minutes}`;
    },
  });

  columns.push({
    Header: t('to'),
    accessor: 'endDate',
    input: {
      node: <TimeInput required />,
      rules: { required: t('fieldRequired') },
    },
    valueRender: (value) => {
      const hours = new Date(value).getHours();
      const minutes = new Date(value).getMinutes();
      return `${hours > 9 ? '' : '0'}${hours}:${minutes > 9 ? '' : '0'}${minutes}`;
    },
  });

  function submit() {
    form.handleSubmit(async (data) => {
      try {
        store.saving = true;
        render();
        await saveConfigRequest({ ...data, program: store.program.id });
        addSuccessAlert(t('configSaved'));
      } catch (e) {
        addErrorAlert(getErrorMessage(e));
      }
      store.saving = false;
      render();
    })();
  }

  async function init() {
    try {
      store.loading = true;
      render();
      const [{ config }, { program }] = await Promise.all([
        getConfigRequest(id),
        detailProgram(id),
      ]);
      store.program = program;
      store.config = config || {};
      if (store.program.moreThanOneAcademicYear) {
        store.config.allCoursesHaveSameConfig = true;
      }
      form.reset(store.config);
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    store.loading = false;
    render();
  }

  React.useEffect(() => {
    if (allCoursesHaveSameDates) {
      const firstStartDateValue = form.getValues(`courseDates[${coursesForDates[0].id}].startDate`);
      const firstEndDateValue = form.getValues(`courseDates[${coursesForDates[0].id}].endDate`);

      forEach(store.program.courses, (c) => {
        form.setValue(`courseDates[${c.id}].startDate`, firstStartDateValue);
        form.setValue(`courseDates[${c.id}].endDate`, firstEndDateValue);
      });
    }
  }, [allCoursesHaveSameDates]);

  React.useEffect(() => {
    if (allCoursesHaveSameConfig) {
      form.setValue('allCoursesHaveSameDates', allCoursesHaveSameConfig);
    }
  }, [allCoursesHaveSameConfig]);

  React.useEffect(() => {
    if (id) init();
  }, [id]);

  return (
    <ContextContainer>
      {loading ? <LoadingOverlay visible /> : null}
      {store.program ? (
        <>
          <Title order={3}>{t('title', { name: store.program.name })}</Title>
          <Controller
            name="allCoursesHaveSameConfig"
            control={form.control}
            render={({ field }) => (
              <Switch
                {...field}
                disabled={store.program.moreThanOneAcademicYear}
                checked={field.value}
                label={t('switchAllCourses', { n: store.program.courses.length })}
              />
            )}
          />
          <Title order={5}>{t('initEndCourse')}</Title>
          {!allCoursesHaveSameConfig ? (
            <Controller
              name="allCoursesHaveSameDates"
              control={form.control}
              render={({ field }) => (
                <Switch {...field} checked={field.value} label={t('allCoursesSameDate')} />
              )}
            />
          ) : null}

          <Box>
            <Grid columns={100}>
              {!allCoursesHaveSameDates ? (
                <Col span={20}>
                  <InputWrapper label={t('course')} />
                </Col>
              ) : null}

              <Col span={allCoursesHaveSameDates ? 50 : 40}>
                <InputWrapper label={t('startDate')} />
              </Col>
              <Col span={allCoursesHaveSameDates ? 50 : 40}>
                <InputWrapper label={t('endDate')} />
              </Col>
            </Grid>
            {map(coursesForDates, (course) => (
              <Grid columns={100} align="center">
                {!allCoursesHaveSameDates ? <Col span={20}>{getCourseName(course)}</Col> : null}
                <Col span={allCoursesHaveSameDates ? 50 : 40}>
                  <Controller
                    name={`courseDates[${course.id}].startDate`}
                    control={form.control}
                    rules={{ required: t('fieldRequired') }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        maxDate={form.watch(`courseDates[${course.id}].endDate`)}
                        onChange={(value) => {
                          if (allCoursesHaveSameDates) {
                            forEach(store.program.courses, (c) => {
                              form.setValue(`courseDates[${c.id}].startDate`, value);
                            });
                          } else {
                            field.onChange(value);
                          }
                        }}
                        required
                        error={get(formErrors, `courseDates[${course.id}].startDate`)}
                      />
                    )}
                  />
                </Col>
                <Col span={allCoursesHaveSameDates ? 50 : 40}>
                  <Controller
                    name={`courseDates[${course.id}].endDate`}
                    control={form.control}
                    rules={{ required: t('fieldRequired') }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        minDate={form.watch(`courseDates[${course.id}].startDate`)}
                        onChange={(value) => {
                          if (allCoursesHaveSameDates) {
                            forEach(store.program.courses, (c) => {
                              form.setValue(`courseDates[${c.id}].endDate`, value);
                            });
                          } else {
                            field.onChange(value);
                          }
                        }}
                        required
                        error={get(formErrors, `courseDates[${course.id}].endDate`)}
                      />
                    )}
                  />
                </Col>
              </Grid>
            ))}
          </Box>

          <Title order={5}>{t('breaks')}</Title>

          <Controller
            name={`breaks`}
            control={form.control}
            render={({ field }) => (
              <TableInput
                data={field.value || []}
                onChange={(ev) => {
                  const courseIds = map(store.program.courses, 'id');
                  field.onChange(
                    map(ev, (e) => {
                      if (!e.courses) e.courses = courseIds;
                    })
                  );
                }}
                columns={columns}
                sortable={false}
                removable={true}
                labels={{
                  add: t('tableAdd'),
                  remove: t('tableRemove'),
                }}
              />
            )}
          />

          <Stack justifyContent="end">
            <Button loading={store.saving} onClick={submit}>
              {t('save')}
            </Button>
          </Stack>
        </>
      ) : null}
    </ContextContainer>
  );
}

AcademicCalendarDetail.propTypes = {
  program: PropTypes.any,
};
