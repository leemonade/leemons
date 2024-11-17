import React from 'react';
import { ScoresBasicTable } from './ScoresBasicTable';
import { SCORES_BASIC_TABLE_DEFAULT_PROPS } from './ScoresBasicTable.constants';

const generateRandomActivities = () => {
  const activities = [];
  for (let i = 1; i <= 6; i++) {
    const shouldSkip = Math.random() > 0.2;
    const isSubmitted = Math.random() > 0.2;
    activities.push({
      id: `a-0${i}`,
      score: isSubmitted ? (shouldSkip ? Math.floor(Math.random() * 10) : undefined) : undefined,
      isSubmitted: isSubmitted,
    });
  }
  return activities;
};

const generateRandomExpandedActivities = () => {
  const activities = [];
  for (let i = 1; i <= 3; i++) {
    const shouldSkip = Math.random() > 0.2;
    const isSubmitted = Math.random() > 0.2;
    activities.push({
      id: `expanded-a-0${i}`,
      score: isSubmitted ? (shouldSkip ? Math.floor(Math.random() * 10) : undefined) : undefined,
      isSubmitted: isSubmitted,
    });
  }
  return activities;
};

export default {
  title: 'leemons/Scores/ScoresBasicTable',
  parameters: {
    component: ScoresBasicTable,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    onChange: { action: 'onChange' },
    onDataChange: { action: 'onDataChange' },
    onColumnExpand: { action: 'onColumnExpand' },
    onOpen: { action: 'onOpen' },
  },
};

const Template = ({ grades, useLetters, ...props }) => {
  const gradesToUse = useLetters
    ? grades
    : grades.map(({ number }) => {
        return { number };
      });

  return <ScoresBasicTable {...props} grades={gradesToUse} />;
};

export const Playground = Template.bind({});

Playground.args = {
  ...SCORES_BASIC_TABLE_DEFAULT_PROPS,
  useLetters: false,
  labels: {
    students: 'Estudiante',
    noActivity: 'No entregado',
    avgScore: 'Weighted score',
    gradingTasks: 'Grading tasks',
    customScore: 'Custom',
  },
  grades: [
    {
      number: 0,
      letter: 'F',
    },
    {
      number: 0.667,
      letter: 'D-',
    },
    {
      number: 1,
      letter: 'D',
    },
    {
      number: 1.333,
      letter: 'D+',
    },
    {
      number: 1.667,
      letter: 'C-',
    },
    {
      number: 2,
      letter: 'C',
    },
    {
      number: 2.333,
      letter: 'C+',
    },
    {
      number: 2.667,
      letter: 'B-',
    },
    {
      number: 3,
      letter: 'B',
    },
    {
      number: 3.333,
      letter: 'B+',
    },
    {
      number: 3.667,
      letter: 'A-',
    },
    {
      number: 4,
      letter: 'A',
    },
  ],
  activities: [
    {
      id: 'a-01',
      name: 'Test Moriscos',
      deadline: '2020-01-01',
      expandable: true,
      allowChange: false,
      weight: 0.3,
      type: 'calificable',
    },
    {
      id: 'a-02',
      name: 'La historia detras del cuadro',
      deadline: '2020-02-20',
      expandable: true,
      allowChange: true,
      weight: 0.8,
      type: 'evaluable',
    },
    {
      id: 'a-03',
      name: 'Patios moriscos',
      deadline: '2020-03-10',
      expandable: true,
      allowChange: true,
      weight: 0.0,
      type: 'calificable',
    },
    {
      id: 'a-04',
      name: 'Examen siglo XVII',
      deadline: '2020-04-20',
      expandable: true,
      allowChange: true,
      weight: 0.1,
      type: 'evaluable',
    },
    {
      id: 'a-05',
      name: 'La edad del bronze',
      deadline: '2020-05-09',
      expandable: true,
      allowChange: true,
      weight: 0.5,
      type: 'calificable',
    },
    {
      id: 'a-06',
      name: 'La edad media',
      deadline: '2020-06-30',
      expandable: true,
      allowChange: true,
      weight: 0.2,
      type: 'evaluable',
    },
  ],
  value: [
    {
      id: 's-01',
      name: 'Michael',
      surname: 'Scott',
      image: 'https://areajugones.sport.es/wp-content/uploads/2021/05/the-office-2.jpg',
      activities: generateRandomActivities(),
      customScore: 8.73,
      allowCustomChange: true,
    },
    {
      id: 's-02',
      name: 'Dwight',
      surname: 'Schrute',
      image: 'https://pbs.twimg.com/profile_images/1434184964866723852/M5c8uqF7_400x400.jpg',
      activities: generateRandomActivities(),
      allowCustomChange: true,
    },
    {
      id: 's-03',
      name: 'Jim',
      surname: 'Halpert',
      image:
        'https://en.meming.world/images/en/thumb/6/6d/Jim_Halpert_Smiling_Through_Blinds.jpg/300px-Jim_Halpert_Smiling_Through_Blinds.jpg',
      activities: generateRandomActivities(),
      allowCustomChange: true,
    },
    {
      id: 's-04',
      name: 'Pam',
      surname: 'Beesly',
      image:
        'https://gcdn.lanetaneta.com/wp-content/uploads/2019/09/The-Office-10-veces-que-Pam-recibió-un-trato-mucho-780x405.jpg',
      activities: generateRandomActivities(),
      allowCustomChange: true,
    },
    {
      id: 's-05',
      name: 'Ryan',
      surname: 'Howard',
      image:
        'https://vader.news/__export/1616206384907/sites/gadgets/img/2021/03/19/ryan_howard.jpg_1962491361.jpg',
      activities: generateRandomActivities(),
      allowCustomChange: true,
    },
    {
      id: 's-06',
      name: 'Kelly',
      surname: 'Kapoor',
      activities: generateRandomActivities(),
      allowCustomChange: true,
    },
    {
      id: 's-07',
      name: 'Angela',
      surname: 'Martin',
      activities: generateRandomActivities(),
      allowCustomChange: true,
    },
    {
      id: 's-08',
      name: 'Oscar',
      surname: 'Martinez',
      image: 'https://poptv.orange.es/wp-content/uploads/sites/3/2020/08/oscar-nuncc83ez.jpeg',
      activities: generateRandomActivities(),
      allowCustomChange: true,
    },
    {
      id: 's-09',
      name: 'Phyllis',
      surname: 'Lapin',
      image: 'https://cinematicos.net/wp-content/uploads/l-intro-1624653656.jpg',
      activities: generateRandomActivities(),
      allowCustomChange: true,
    },
    {
      id: 's-10',
      name: 'Stanley',
      surname: 'Hudson',
      image: 'https://www.cinepremiere.com.mx/wp-content/uploads/2020/07/stanley-the-office.jpg',
      activities: generateRandomActivities(),
      allowCustomChange: true,
    },
    {
      id: 's-11',
      name: 'Meredith',
      surname: 'Palmer',
      activities: generateRandomActivities(),
      allowCustomChange: true,
    },
  ],
  expandedData: {
    activities: [
      { id: 'expanded-a-01', name: 'El imperio romano', deadline: '2020-01-01', allowChange: true },
      {
        id: 'expanded-a-02',
        name: 'Periodo de los Reinos combatientes',
        deadline: '2020-02-20',
        allowChange: false,
      },
      {
        id: 'expanded-a-03',
        name: 'Migraciones humanas',
        deadline: '2020-03-10',
        allowChange: true,
      },
    ],
    value: [
      {
        id: 's-01',
        name: 'Michael',
        surname: 'Scott',
        image: 'https://areajugones.sport.es/wp-content/uploads/2021/05/the-office-2.jpg',
        activities: generateRandomExpandedActivities(),
      },
      {
        id: 's-02',
        name: 'Dwight',
        surname: 'Schrute',
        image: 'https://pbs.twimg.com/profile_images/1434184964866723852/M5c8uqF7_400x400.jpg',
        activities: generateRandomExpandedActivities(),
      },
      {
        id: 's-03',
        name: 'Jim',
        surname: 'Halpert',
        image:
          'https://en.meming.world/images/en/thumb/6/6d/Jim_Halpert_Smiling_Through_Blinds.jpg/300px-Jim_Halpert_Smiling_Through_Blinds.jpg',
        activities: generateRandomExpandedActivities(),
      },
      {
        id: 's-04',
        name: 'Pam',
        surname: 'Beesly',
        image:
          'https://gcdn.lanetaneta.com/wp-content/uploads/2019/09/The-Office-10-veces-que-Pam-recibió-un-trato-mucho-780x405.jpg',
        activities: generateRandomExpandedActivities(),
      },
      {
        id: 's-05',
        name: 'Ryan',
        surname: 'Howard',
        image:
          'https://vader.news/__export/1616206384907/sites/gadgets/img/2021/03/19/ryan_howard.jpg_1962491361.jpg',
        activities: generateRandomExpandedActivities(),
      },
      {
        id: 's-06',
        name: 'Kelly',
        surname: 'Kapoor',
        activities: generateRandomExpandedActivities(),
      },
      {
        id: 's-07',
        name: 'Angela',
        surname: 'Martin',
        activities: generateRandomExpandedActivities(),
      },
      {
        id: 's-08',
        name: 'Oscar',
        surname: 'Martinez',
        image: 'https://poptv.orange.es/wp-content/uploads/sites/3/2020/08/oscar-nuncc83ez.jpeg',
        activities: generateRandomExpandedActivities(),
      },
      {
        id: 's-09',
        name: 'Phyllis',
        surname: 'Lapin',
        image: 'https://cinematicos.net/wp-content/uploads/l-intro-1624653656.jpg',
        activities: generateRandomExpandedActivities(),
      },
      {
        id: 's-10',
        name: 'Stanley',
        surname: 'Hudson',
        image: 'https://www.cinepremiere.com.mx/wp-content/uploads/2020/07/stanley-the-office.jpg',
        activities: generateRandomExpandedActivities(),
      },
      {
        id: 's-11',
        name: 'Meredith',
        surname: 'Palmer',
        activities: generateRandomExpandedActivities(),
      },
    ],
  },
};
