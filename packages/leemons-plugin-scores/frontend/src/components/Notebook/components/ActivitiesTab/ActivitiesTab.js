import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  createStyles,
  ImageLoader,
  SearchInput,
  Select,
  Switch,
  Text,
  Title,
  useResizeObserver,
} from '@bubbles-ui/components';
import { ScoresBasicTable } from '@bubbles-ui/leemons';

import useSearchAssignableInstances from '@assignables/hooks/assignableInstance/useSearchAssignableInstancesQuery';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import useAssignableInstances from '@assignables/hooks/assignableInstance/useAssignableInstancesQuery';
import { map, uniq, isFunction } from 'lodash';
import { useUserAgentsInfo } from '@users/hooks';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
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
  },
}));

function Filters({ onChange }) {
  const { classes } = useStyles();
  const { control, watch } = useForm({
    defaultValues: {
      search: '',
      filterBy: null,
      showNonCalificables: false,
    },
  });

  const filterBy = React.useMemo(
    () => [
      {
        label: 'Actividad',
        value: 'activity',
      },
      {
        label: 'Alumno',
        value: 'student',
      },
    ],
    []
  );

  React.useEffect(() => {
    if (isFunction(onChange)) {
      let timer;
      const unSubscribe = watch((values) => {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          onChange(values);
        }, 500);
      });

      return () => {
        unSubscribe();
      };
    }
    return () => {};
  }, [onChange, watch]);

  const filterByLength = React.useMemo(
    () => filterBy.reduce((maxLength, filter) => Math.max(maxLength, filter.label.length), 0),
    [filterBy]
  );

  return (
    <Box className={classes.filters}>
      <Box className={classes.leftFilters}>
        <Controller
          control={control}
          name="filterBy"
          render={({ field }) => (
            <Select
              variant="unstyled"
              placeholder="Filter by"
              style={{ width: `${filterByLength + 5}ch` }}
              data={filterBy}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="search"
          render={({ field }) => <SearchInput placeholder="Search" {...field} />}
        />
        <Controller
          control={control}
          name="showNonCalificables"
          render={({ field }) => (
            <Switch size="md" label="Ver no calificables" {...field} checked={field.value} />
          )}
        />
        {/* <Switch size="md" label="Asessment criteria" /> */}
      </Box>
      <Button>Guardar notas</Button>
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

    if (
      (localFilters.filterBy === 'activity' && localFilters.search?.length) ||
      !localFilters.showNonCalificables
    ) {
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
        if (!localFilters.showNonCalificables && !assignableInstance.gradable) {
          return false;
        }
        return true;
      });
    }

    let values = assignableInstances.reduce((studentsValues, activity) => {
      activity.students.forEach((student) => {
        const grade = student.grades.find(
          (g) => g.type === 'main' && g.subject === filters.subject
        );

        if (!grade) {
          return;
        }

        // eslint-disable-next-line no-param-reassign
        studentsValues[student.user] = {
          activities: [
            ...(studentsValues[student.user]?.activities || []),
            {
              id: activity.id,
              score: grade.grade,
              grade,
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
        name: student.user.name,
        surname: student.user.surnames,
        image: student.user.avatar,
      };
    });

    values = Object.values(values);

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

    const tableData = {
      activities: assignableInstances.map((activity) => ({
        id: activity.id,
        name: activity.assignable.asset.name,
        deadline: activity.dates.deadline || null,
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

function ScoresTable({ activitiesData, grades, filters }) {
  const { mutateAsync } = useStudentAssignationMutation();
  const data = React.useMemo(
    () => ({
      labels: {
        students: 'Estudiante',
        noActivity: 'No entregado',
        avgScore: 'Average score',
        gradingTasks: 'Grading tasks',
        attendance: 'Attendance',
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
          const grade = data.grades.find((g) => g.number === parseInt(v.value, 10));

          console.log(
            'student',
            student,
            'activity',
            activity,
            'grade',
            grade,
            data.grades,
            v.value
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
                `Updated ${student.name} ${student.surname}'s score for ${activity.name} to a ${
                  grade.letter || grade.number
                }`
              )
            )
            .catch((e) =>
              addErrorAlert(
                `Error updating ${student.name} ${student.surname}'s score for ${
                  activity.name
                } to a ${grade.letter || grade.number}: ${e.message}`
              )
            );
        }}
      />
    </Box>
  );
}

function EmptyState() {
  const [ref, rect] = useResizeObserver();

  const top = React.useMemo(() => ref.current?.getBoundingClientRect()?.top, [ref, rect]);

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
            <Title>No results copy</Title>
            <Text>
              Scores allow you to rating grading and non-grading task and attendance control.
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default function ActivitiesTab({ filters }) {
  const { classes } = useStyles();
  const labels = {};
  const [localFilters, setLocalFilters] = React.useState({});
  const { activitiesData, grades } = useTableData({ filters, localFilters });
  return (
    <Box>
      <Filters onChange={setLocalFilters} />
      {activitiesData?.activities?.length && grades?.length && activitiesData?.value?.length ? (
        <ScoresTable activitiesData={activitiesData} grades={grades} filters={filters} />
      ) : (
        <EmptyState />
      )}
    </Box>
  );
}
