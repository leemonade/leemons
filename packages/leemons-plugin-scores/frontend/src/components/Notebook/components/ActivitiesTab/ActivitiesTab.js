import React from 'react';
import {
  Box,
  Button,
  createStyles,
  SearchInput,
  Select,
  Switch,
  TabPanel,
  Tabs,
} from '@bubbles-ui/components';
import { ScoresBasicTable } from '@bubbles-ui/leemons';

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
function ScoresTable() {
  const generateRandomActivities = () => {
    const activities = [];
    for (let i = 1; i <= 6; i++) {
      const shouldSkip = Math.random() > 0.7;
      if (shouldSkip) continue;
      activities.push({
        id: `a-0${i}`,
        score: Math.floor(Math.random() * 10),
      });
    }
    return activities;
  };
  const tableData = React.useMemo(
    () => ({
      labels: {
        students: 'Estudiante',
        noActivity: 'No entregado',
        avgScore: 'Average score',
        gradingTasks: 'Grading tasks',
        attendance: 'Attendance',
      },
      grades: [
        { number: 0, letter: 'F' },
        { number: 1, letter: 'E' },
        { number: 2, letter: 'E+' },
        { number: 3, letter: 'D' },
        { number: 4, letter: 'D+' },
        { number: 5, letter: 'C' },
        { number: 6, letter: 'C+' },
        { number: 7, letter: 'B' },
        { number: 8, letter: 'B+' },
        { number: 9, letter: 'A' },
        { number: 10, letter: 'A+' },
      ],
      activities: [
        { id: 'a-01', name: 'Test Moriscos', deadline: '2020-01-01' },
        { id: 'a-02', name: 'La historia detras del cuadro', deadline: '2020-02-20' },
        { id: 'a-03', name: 'Patios moriscos', deadline: '2020-03-10' },
        { id: 'a-04', name: 'Examen siglo XVII', deadline: '2020-04-20' },
        { id: 'a-05', name: 'La edad del bronze', deadline: '2020-05-09' },
        { id: 'a-06', name: 'La edad media', deadline: '2020-06-30' },
      ],
      value: [
        {
          id: 's-01',
          name: 'Michael',
          surname: 'Scott',
          image: 'https://areajugones.sport.es/wp-content/uploads/2021/05/the-office-2.jpg',
          activities: generateRandomActivities(),
        },
        {
          id: 's-02',
          name: 'Dwight',
          surname: 'Schrute',
          image: 'https://pbs.twimg.com/profile_images/1434184964866723852/M5c8uqF7_400x400.jpg',
          activities: generateRandomActivities(),
        },
        {
          id: 's-03',
          name: 'Jim',
          surname: 'Halpert',
          image:
            'https://en.meming.world/images/en/thumb/6/6d/Jim_Halpert_Smiling_Through_Blinds.jpg/300px-Jim_Halpert_Smiling_Through_Blinds.jpg',
          activities: generateRandomActivities(),
        },
        {
          id: 's-04',
          name: 'Pam',
          surname: 'Beesly',
          image:
            'https://gcdn.lanetaneta.com/wp-content/uploads/2019/09/The-Office-10-veces-que-Pam-recibió-un-trato-mucho-780x405.jpg',
          activities: generateRandomActivities(),
        },
        {
          id: 's-05',
          name: 'Ryan',
          surname: 'Howard',
          image:
            'https://vader.news/__export/1616206384907/sites/gadgets/img/2021/03/19/ryan_howard.jpg_1962491361.jpg',
          activities: generateRandomActivities(),
        },
        {
          id: 's-06',
          name: 'Kelly',
          surname: 'Kapoor',
          activities: generateRandomActivities(),
        },
        {
          id: 's-07',
          name: 'Angela',
          surname: 'Martin',
          activities: generateRandomActivities(),
        },
        {
          id: 's-08',
          name: 'Oscar',
          surname: 'Martinez',
          image: 'https://poptv.orange.es/wp-content/uploads/sites/3/2020/08/oscar-nuncc83ez.jpeg',
          activities: generateRandomActivities(),
        },
        {
          id: 's-09',
          name: 'Phyllis',
          surname: 'Lapin',
          activities: generateRandomActivities(),
        },
        {
          id: 's-10',
          name: 'Stanley',
          surname: 'Hudson',
          activities: generateRandomActivities(),
        },
        {
          id: 's-11',
          name: 'Meredith',
          surname: 'Palmer',
          activities: generateRandomActivities(),
        },
        {
          id: 's-12',
          name: 'Creed',
          surname: 'Bratton',
          activities: generateRandomActivities(),
        },
        {
          id: 's-13',
          name: 'Darryl',
          surname: 'Philbin',
          activities: generateRandomActivities(),
        },
        {
          id: 's-14',
          name: 'Kelly',
          surname: 'Kapoor',
          activities: generateRandomActivities(),
        },
        {
          id: 's-15',
          name: 'Angela',
          surname: 'Martin',
          activities: generateRandomActivities(),
        },

        {
          id: 's-16',
          name: 'Oscar',
          surname: 'Martinez',
          activities: generateRandomActivities(),
        },
        {
          id: 's-17',
          name: 'Phyllis',
          surname: 'Lapin',
          activities: generateRandomActivities(),
        },
        {
          id: 's-18',
          name: 'Stanley',
          surname: 'Hudson',
          activities: generateRandomActivities(),
        },
        {
          id: 's-19',
          name: 'Meredith',
          surname: 'Palmer',
          activities: generateRandomActivities(),
        },
        {
          id: 's-20',
          name: 'Creed',
          surname: 'Bratton',
          activities: generateRandomActivities(),
        },
        {
          id: 's-21',
          name: 'Darryl',
          surname: 'Philbin',
          activities: generateRandomActivities(),
        },
      ],
    }),
    []
  );

  return (
    <Box>
      <ScoresBasicTable {...tableData} />
    </Box>
  );
}

export default function ActivitiesTab() {
  const { classes } = useStyles();
  const labels = {};
  return (
    <Box>
      <Filters />
      <ScoresTable />
    </Box>
  );
}
