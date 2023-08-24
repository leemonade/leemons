import React from 'react';
import PropTypes from 'prop-types';
import { forEach, map } from 'lodash';
import {
  Box,
  Button,
  ContextContainer,
  createStyles,
  MultiSelect,
  Paragraph,
  Stack,
  Switch,
  TableInput,
  TabPanel,
  Tabs,
  TextInput,
  TimeInput,
  Title,
  useDebouncedCallback,
} from '@bubbles-ui/components';
import useRequestErrorMessage from '@common/useRequestErrorMessage';
import { useLocale, useStore } from '@common';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { addErrorAlert } from '@layout/alert';
import { Controller, useForm } from 'react-hook-form';
import getCourseName from '@academic-portfolio/helpers/getCourseName';
import CourseData from '@academic-calendar/pages/private/program/components/CourseData';

const useStyle = createStyles((theme) => ({
  root: {
    padding: theme.spacing[5],
    maxWidth: 700,
    width: '100%',
  },
}));

export default function Step2({ config, program, onPrev, onChange, t }) {
  const locale = useLocale();
  const { classes } = useStyle();
  const [, , , getErrorMessage] = useRequestErrorMessage();

  const callback = useDebouncedCallback(500);

  const programMode = program.courses.length <= 1;

  const [store, render] = useStore({
    program,
    forms: {},
  });

  React.useEffect(() => {
    const subscriptions = [];
    forEach(Object.keys(store.forms), (key) => {
      subscriptions.push(
        store.forms[key].watch(() => {
          callback(render);
        })
      );
    });
    return () => {
      forEach(subscriptions, (subscription) => subscription.unsubscribe());
    };
  }, [store.forms]);

  const form = useForm({ defaultValues: config });
  const formErrors = form.formState.errors;
  const courseDates = form.watch('courseDates') || {};
  const substagesDates = form.watch('substagesDates') || {};
  const courseEvents = form.watch('courseEvents') || [];
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
        if (value) {
          if (value.length === courseData.length) {
            return t('allCourses');
          }
          return <MultiSelect readOnly data={courseData} value={value} />;
        }
        return null;
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

  function checkValidity() {
    return new Promise((resolve) => {
      const totalForms = Object.keys(store.forms).length + 1;
      let formsChecked = 0;
      let allValid = true;
      form.handleSubmit(
        () => {
          formsChecked++;
        },
        () => {
          formsChecked++;
          allValid = false;
        }
      )();
      forEach(Object.keys(store.forms), (key) => {
        store.forms[key].handleSubmit(
          () => {
            formsChecked++;
          },
          () => {
            formsChecked++;
            allValid = false;
          }
        )();
      });
      const interval = setInterval(() => {
        if (formsChecked === totalForms) {
          clearInterval(interval);
          resolve(allValid);
        }
      }, 1000 / 60);
    });
  }

  async function submit() {
    try {
      const isValid = await checkValidity();
      if (isValid) {
        onChange(form.getValues());
      }
    } catch (e) {
      addErrorAlert(getErrorMessage(e));
    }
    render();
  }

  React.useEffect(() => {
    if (allCoursesHaveSameDates) {
      const firstStartDateValue = form.getValues(`courseDates[${coursesForDates[0].id}].startDate`);
      const firstEndDateValue = form.getValues(`courseDates[${coursesForDates[0].id}].endDate`);
      const substages = form.getValues(`substagesDates[${coursesForDates[0].id}]`);
      const events = form.getValues(`courseEvents[${coursesForDates[0].id}]`);

      forEach(store.program.courses, (c) => {
        form.setValue(`courseDates[${c.id}].startDate`, firstStartDateValue);
        form.setValue(`courseDates[${c.id}].endDate`, firstEndDateValue);
        form.setValue(`substagesDates[${c.id}]`, substages);
        form.setValue(`courseEvents[${c.id}]`, events);
      });
    }
  }, [allCoursesHaveSameDates]);

  function onForm(index) {
    return (f) => {
      if (f) {
        store.forms[index] = f;
      } else {
        delete store.forms[index];
      }
    };
  }

  if (!store.program || !locale) return null;

  return (
    <ContextContainer divided>
      <ContextContainer>
        <Title order={3}>{t('academicPeriods')}</Title>
        {programMode ? (
          <>
            <CourseData
              locale={locale}
              startLabel={t('initOfProgram')}
              endLabel={t('endOfProgram')}
              course={store.program?.courses[0]}
              value={{
                ...courseDates[store.program?.courses[0].id],
                substages: substagesDates[store.program?.courses[0].id] || {},
                events: courseEvents[store.program?.courses[0].id] || [],
              }}
              onForm={onForm(store.program?.courses[0].id)}
              onChange={(values) => {
                form.setValue(
                  `courseDates[${store.program?.courses[0].id}].startDate`,
                  values.startDate
                );
                form.setValue(
                  `courseDates[${store.program?.courses[0].id}].endDate`,
                  values.endDate
                );
                form.setValue(`substagesDates[${store.program?.courses[0].id}]`, values.substages);
                form.setValue(`courseEvents[${store.program?.courses[0].id}]`, values.events);
              }}
              program={program}
              t={t}
            />
          </>
        ) : (
          <>
            <Controller
              name="allCoursesHaveSameDates"
              control={form.control}
              render={({ field }) => (
                <Switch {...field} checked={field.value} label={t('allCoursesShareTheSameDates')} />
              )}
            />

            <Tabs forceRender>
              {coursesForDates.map((course) => {
                let hasError = false;
                if (
                  store.forms[course.id]?.formState.errors &&
                  Object.keys(store.forms[course.id]?.formState.errors).length
                ) {
                  hasError = true;
                }
                return (
                  <TabPanel
                    hasError={hasError}
                    key={course.id}
                    label={
                      allCoursesHaveSameDates ? t('allCourses') : `${t('course')} ${course.index}`
                    }
                  >
                    <CourseData
                      locale={locale}
                      course={course}
                      value={{
                        ...courseDates[course.id],
                        substages: substagesDates[course.id] || {},
                        events: courseEvents[course.id] || [],
                      }}
                      onForm={onForm(course.id)}
                      onChange={(values) => {
                        if (allCoursesHaveSameDates) {
                          forEach(store.program.courses, (c) => {
                            form.setValue(`courseDates[${c.id}].startDate`, values.startDate);
                            form.setValue(`courseDates[${c.id}].endDate`, values.endDate);
                            form.setValue(`substagesDates[${c.id}]`, values.substages);
                            form.setValue(`courseEvents[${c.id}]`, values.events);
                          });
                        } else {
                          form.setValue(`courseDates[${course.id}].startDate`, values.startDate);
                          form.setValue(`courseDates[${course.id}].endDate`, values.endDate);
                          form.setValue(`substagesDates[${course.id}]`, values.substages);
                          form.setValue(`courseEvents[${course.id}]`, values.events);
                        }
                      }}
                      program={program}
                      t={t}
                    />
                  </TabPanel>
                );
              })}
            </Tabs>
          </>
        )}
      </ContextContainer>
      <ContextContainer>
        <Box>
          <Title order={3}>{t('hoursOfPauseOrDailyBreaks')}</Title>
          <Paragraph>{t('hoursOfPauseOrDailyBreaksDescription')}</Paragraph>
        </Box>

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
                    return e;
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
      </ContextContainer>

      <Stack justifyContent="space-between">
        <Button
          onClick={() => {
            onPrev(form.getValues());
          }}
          compact
          variant="light"
          leftIcon={<ChevLeftIcon height={20} width={20} />}
        >
          {t('previous')}
        </Button>
        <Button onClick={submit}>{t('continueButton')}</Button>
      </Stack>
    </ContextContainer>
  );
}

Step2.propTypes = {
  program: PropTypes.any,
  config: PropTypes.any,
  onChange: PropTypes.func,
  onPrev: PropTypes.func,
  t: PropTypes.func,
};
