import React from 'react';
import { Box, Button, createStyles, SearchInput, Select, Switch } from '@bubbles-ui/components';
import { ScoresBasicTable } from '@bubbles-ui/leemons';

import useSearchAssignableInstances from '@assignables/hooks/assignableInstance/useSearchAssignableInstancesQuery';
import useSessionClasses from '@academic-portfolio/hooks/useSessionClasses';
import useAssignableInstances from '@assignables/hooks/assignableInstance/useAssignableInstancesQuery';
import { map, uniq } from 'lodash';
import { useUserAgentsInfo } from '@users/hooks';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';

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

function Filters() {
  const { classes } = useStyles();

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

  const filterByLength = React.useMemo(
    () => filterBy.reduce((maxLength, filter) => Math.max(maxLength, filter.label.length), 0),
    [filterBy]
  );

  return (
    <Box className={classes.filters}>
      <Box className={classes.leftFilters}>
        <Select
          variant="unstyled"
          placeholder="Filter by"
          style={{ width: `${filterByLength + 5}ch` }}
          data={filterBy}
        />
        <SearchInput placeholder="Search" />
        <Switch size="md" label="Ver no calificables" />
        <Switch size="md" label="Asessment criteria" />
      </Box>
      <Button>Guardar notas</Button>
    </Box>
  );
}

function useTableData({ filters }) {
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

  const assignableInstances = React.useMemo(
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

    const values = assignableInstances.reduce((studentsValues, activity) => {
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
            ...(studentsValues[student.user] || []),
            {
              id: activity.id,
              score: grade.grade,
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

    const tableData = {
      activities: assignableInstances.map((activity) => ({
        id: activity.id,
        name: activity.assignable.asset.name,
        deadline: activity.dates.deadline || null,
      })),
      value: Object.values(values),
    };
    return tableData;
  }, [assignableInstances, students]);

  return {
    activitiesData,
    grades: evaluationSystem?.scales,
  };
}

function ScoresTable({ activitiesData, grades }) {
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

  if (!data.grades?.length || !data.activities?.length) {
    return null;
  }
  return (
    <Box>
      <ScoresBasicTable {...data} />
    </Box>
  );
}

export default function ActivitiesTab({ filters }) {
  const { classes } = useStyles();
  const labels = {};
  const { activitiesData, grades } = useTableData({ filters });
  return (
    <Box>
      <Filters />
      <ScoresTable activitiesData={activitiesData} grades={grades} />
    </Box>
  );
}
