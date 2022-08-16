import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  createStyles,
  ImageLoader,
  ProSwitch,
  SearchInput,
  Select,
  Text,
  Title,
  useResizeObserver,
} from '@bubbles-ui/components';
import { ScoresBasicTable } from '@bubbles-ui/leemons';

import useSearchAssignableInstances from '@assignables/hooks/assignableInstance/useSearchAssignableInstancesQuery';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import useAssignableInstances from '@assignables/hooks/assignableInstance/useAssignableInstancesQuery';
import _, { map, uniq, isFunction } from 'lodash';
import { useUserAgentsInfo } from '@users/hooks';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';

import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@scores/helpers';
import { CutStarIcon } from '@bubbles-ui/icons/solid';
import { addAction, fireEvent, removeAction } from 'leemons-hooks';
import generateExcel from '@scores/components/ExcelExport/excel';
import getFile from '@scores/components/ExcelExport/excel/config/getFile';
import { useProgramDetail, useSubjectDetails } from '@academic-portfolio/hooks';
import noResults from '../../assets/noResults.png';

const useStyles = createStyles((theme) => ({
  filters: {
    backgroundColor: theme.colors.interactive03,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing[2],
    width: '100%',
  },
  leftFilters: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  leftFiltersGroup: {
    gap: theme.spacing[1],
  },
}));

function Filters({ onChange, labels }) {
  const { classes, theme, cx } = useStyles();
  const { control, watch } = useForm({
    defaultValues: {
      search: '',
      filterBy: 'student',
      showNonCalificables: false,
    },
  });

  const filterBy = React.useMemo(
    () => [
      {
        label: labels?.filterBy?.activity,
        value: 'activity',
      },
      {
        label: labels?.filterBy?.student,
        value: 'student',
      },
    ],
    []
  );

  React.useEffect(() => {
    if (isFunction(onChange)) {
      let timer;
      const subscription = watch((values) => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          onChange(values);
        }, 500);
      });

      return subscription.unsubscribe;
    }
    return () => {};
  }, [onChange, watch]);

  const filterByLength = React.useMemo(() => {
    const valuesMaxLength = filterBy.reduce(
      (maxLength, filter) => Math.max(maxLength, filter.label.length),
      0
    );
    return Math.max(valuesMaxLength, labels?.filterBy?.placeholder?.length);
  }, [filterBy]);

  return (
    <Box className={classes.filters}>
      <Box className={classes.leftFilters}>
        <Box className={cx(classes.leftFilters, classes.leftFiltersGroup)}>
          <Controller
            control={control}
            name="filterBy"
            render={({ field }) => (
              <>
                <Select
                  placeholder={labels?.filterBy?.placeholder}
                  style={{ width: `${filterByLength + 5}ch` }}
                  data={filterBy}
                  ariaLabel={labels?.filterBy?.placeholder}
                  {...field}
                />
              </>
            )}
          />
          <Controller
            control={control}
            name="search"
            render={({ field }) => {
              const filterByValue = watch('filterBy');
              return (
                <SearchInput
                  placeholder={labels?.search
                    ?.replace(
                      '{{filterBy}}',
                      filterBy.find((item) => item.value === filterByValue).label
                    )
                    ?.replace(
                      '{{filterBy.toLowerCase}}',
                      filterBy.find((item) => item.value === filterByValue).label.toLowerCase()
                    )}
                  {...field}
                />
              );
            }}
          />
        </Box>
        <Controller
          control={control}
          name="showNonCalificables"
          render={({ field }) => (
            <Box sx={{ height: 20 }}>
              <ProSwitch
                icon={<CutStarIcon height={12} />}
                size="md"
                color={theme.colors.interactive01}
                label={labels?.nonCalificables}
                {...field}
                checked={field.value}
              />
            </Box>
          )}
        />
        {/* <Switch size="md" label="Asessment criteria" /> */}
      </Box>
    </Box>
  );
}

function useTableData({ filters, localFilters }) {
  const { data: sessionClasses } = useSessionClasses(
    { program: filters.program },
    { enabled: !!filters.program }
  );
  const selectedClasses = React.useMemo(() => {
    if (!sessionClasses) {
      return [];
    }

    const classesMatchingFilters = sessionClasses
      .filter(
        (klass) =>
          (klass.subject.subject === filters.subject || klass.subject.id === filters.subject) &&
          (!filters.group || klass.groups.id === filters.group)
      )
      .map((klass) => klass.id);

    return classesMatchingFilters;
  }, [sessionClasses, filters]);

  const { data: activities } = useSearchAssignableInstances(
    {
      finished: true,
      finished_$gt: filters.startDate,
      finished_$lt: filters.endDate,
      classes: JSON.stringify(selectedClasses),
    },
    { enabled: !!selectedClasses.length }
  );

  const assignableInstancesQueries = useAssignableInstances({ id: activities || [] });

  let assignableInstances = React.useMemo(
    () => map(assignableInstancesQueries, 'data').filter(Boolean),
    [assignableInstancesQueries]
  );

  const students = React.useMemo(() => {
    const stdnts = assignableInstances.flatMap((assignableInstance) => assignableInstance.students);
    return uniq(map(stdnts, 'user'));
  }, [assignableInstances]);

  const { data: studentsData } = useUserAgentsInfo(students, { enabled: !!students.length });
  const evaluationSystem = useProgramEvaluationSystem(assignableInstances?.[0]);

  const activitiesData = React.useMemo(() => {
    if (!studentsData?.length || !activities?.length) {
      return {};
    }

    assignableInstances = assignableInstances.filter((assignableInstance) => {
      if (
        localFilters.filterBy === 'activity' &&
        localFilters.search?.length &&
        !assignableInstance.assignable.asset.name
          .toLowerCase()
          .includes(localFilters.search.toLowerCase())
      ) {
        return false;
      }
      if (!assignableInstance.requiresScoring) {
        return false;
      }
      if (!localFilters.showNonCalificables && !assignableInstance.gradable) {
        return false;
      }
      return true;
    });

    let values = assignableInstances.reduce((studentsValues, activity) => {
      activity.students.forEach((student) => {
        const grade = student.grades.find(
          (g) => g.type === 'main' && g.subject === filters.subject
        );

        // eslint-disable-next-line no-param-reassign
        studentsValues[student.user] = {
          activities: [
            ...(studentsValues[student.user]?.activities || []),
            {
              id: activity.id,
              score: grade ? grade.grade : undefined,
              grade: grade || undefined,
              isSubmitted: student.timestamps?.end,
            },
          ],
        };
      });

      return studentsValues;
    }, {});

    studentsData.forEach((student) => {
      values[student.id] = {
        activities: values[student.id]?.activities || [],
        id: student.id,
        name: student.user.name || '',
        surname: student.user.surnames || '',
        image: student.user.avatar,
      };
    });

    values = Object.values(values).sort((a, b) => {
      const surnameCompare = a.surname.localeCompare(b.surname);
      if (surnameCompare !== 0) {
        return surnameCompare;
      }

      const nameCompare = a.name.localeCompare(b.name);
      return nameCompare;
    });

    if (localFilters.filterBy === 'student' && localFilters.search?.length) {
      values = values.filter(
        (student) =>
          student.name.toLowerCase().includes(localFilters.search.toLowerCase()) ||
          student.surname.toLowerCase().includes(localFilters.search.toLowerCase()) ||
          `${student.name.toLowerCase()} ${student.surname.toLowerCase()}`.includes(
            localFilters.search.toLowerCase()
          )
      );
    }

    const calificableAssignableInstances = assignableInstances.reduce((count, activity) => {
      if (activity.gradable) {
        return count + 1;
      }
      return count;
    }, 0);

    const tableData = {
      activities: assignableInstances.map((activity) => ({
        id: activity.id,
        name: activity.assignable.asset.name,
        deadline: activity.dates.deadline || activity.dates.closed,
        weight: activity.gradable ? 1 / calificableAssignableInstances : 0,
        allowChange: activity.assignable.role !== 'tests',
        type: activity.gradable ? 'calificable' : 'evaluable',
        activity,
      })),
      value: values,
    };
    return tableData;
  }, [assignableInstances, studentsData, localFilters, filters]);

  return {
    activitiesData,
    grades: evaluationSystem?.scales.sort((a, b) => a.number - b.number),
  };
}

function ScoresTable({ activitiesData, grades, filters, onOpen, labels }) {
  const { mutateAsync } = useStudentAssignationMutation();
  const data = React.useMemo(
    () => ({
      labels: {
        students: labels?.table?.students,
        noActivity: labels?.table?.noActivity,
        avgScore: labels?.table?.avgScore,
        gradingTasks: labels?.table?.gradingTasks,
        attendance: labels?.table?.attendance,
      },
      grades,
      ...activitiesData,
    }),
    [grades, activitiesData]
  );

  return (
    <Box>
      <ScoresBasicTable
        {...data}
        onDataChange={(v) => {
          const student = data.value.find((student) => student.id === v.rowId);
          const activity = data.activities.find((activity) => activity.id === v.columnId);
          const grade = data.grades.find(
            (g) => g.number === parseInt(v.value, 10) || g.letter === v.value
          );

          mutateAsync({
            instance: v.columnId,
            student: v.rowId,
            grades: [
              {
                type: 'main',
                grade: grade.number,
                subject: filters.subject,
              },
            ],
          })
            .then(() =>
              addSuccessAlert(
                labels?.updatedSuccess
                  ?.replace('{{student}}', `${student.name} ${student.surname}`)
                  ?.replace('{{activity}}', activity.name)
                  ?.replace('{{score}}', grade.letter || grade.number)
              )
            )
            .catch((e) =>
              addErrorAlert(
                labels?.updatedError
                  ?.replace('{{student}}', `${student.name} ${student.surname}`)
                  ?.replace('{{activity}}', activity.name)
                  ?.replace('{{score}}', grade.letter || grade.number)
                  ?.replace('{{error}}', e.message || e.error)
              )
            );
        }}
        onOpen={onOpen}
        from={filters?.startDate}
        to={filters?.endDate}
      />
    </Box>
  );
}

function EmptyState() {
  const [ref, rect] = useResizeObserver();

  const top = React.useMemo(() => ref.current?.getBoundingClientRect()?.top, [ref, rect]);

  const [, translations] = useTranslateLoader(prefixPN('notebook.noResults'));

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('notebook.noResults'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `calc(100vh - ${top}px)`,
        width: '100%',
        backgroundColor: theme.white,
      })}
      ref={ref}
    >
      {ref.current && (
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing[4],
          })}
        >
          <ImageLoader
            src={noResults}
            imageStyles={{
              width: 573,
            }}
            height="100%"
          />
          <Box sx={{ maxWidth: 250 }}>
            <Title>{labels?.title}</Title>
            <Text>{labels?.description}</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function ActivitiesTab({ filters, labels }) {
  const { classes } = useStyles();
  const [localFilters, setLocalFilters] = React.useState({});
  const { activitiesData, grades } = useTableData({ filters, localFilters });

  const { data: programData } = useProgramDetail(filters?.program, { enabled: !!filters?.program });
  const { data: subjectData } = useSubjectDetails(filters.subject, { enabled: !!filters.subject });

  const [, translations] = useTranslateLoader(prefixPN('excel'));

  const excelLabels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('excel'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  React.useEffect(() => {
    const onDownload = ({ args: [format] }) => {
      fireEvent('plugins.scores::downloaded-intercepted');

      try {
        const wb = generateExcel({
          headerShown: format === 'xlsx',
          tableData: { ...activitiesData, grades },

          period: {
            period: filters.period?.name || '-',
            startDate: new Date(filters.startDate),
            endDate: new Date(filters.endDate),
            program: programData.name,
            subject: subjectData.name,
          },
          labels: excelLabels,
        });
        getFile(wb, format);
      } catch (e) {
        fireEvent('plugins.scores::download-scores-error', e);
      }
      fireEvent('plugins.scores::downloaded');
    };

    addAction('plugins.scores::download-scores', onDownload);
    return () => removeAction('plugins.scores::download-scores', onDownload);
  }, [activitiesData, grades]);

  const handleOpen = ({ rowId, columnId }) => {
    const activity = activitiesData?.activities?.find((a) => a.id === columnId)?.activity;

    if (!activity) {
      // TRANSLATE: This is a placeholder for the activity name
      return addErrorAlert(labels?.unableToOpen);
    }
    const url = activity.assignable.roleDetails.evaluationDetailUrl;

    window.open(url.replace(':id', columnId).replace(':user', rowId), '_blank');
  };

  return (
    <Box>
      <Filters onChange={setLocalFilters} labels={labels?.filters} />
      {activitiesData?.activities?.length && grades?.length && activitiesData?.value?.length ? (
        <ScoresTable
          activitiesData={activitiesData}
          grades={grades}
          filters={filters}
          onOpen={handleOpen}
          labels={labels?.scoresTable}
        />
      ) : (
        <EmptyState />
      )}
    </Box>
  );
}
