import React from 'react';
import { ScoresReviewerTable } from './ScoresReviewerTable';
import { SCORES_REVIEWER_TABLE_DEFAULT_PROPS } from './ScoresReviewerTable.constants';

const getPeriodName = (index) => {
  const names = ['1st', '2nd', '3th', 'Final'];
  return names[index];
};

const generateRandomSubjects = () => {
  const activities = [];
  for (let i = 1; i <= 3; i++) {
    let periodScores = [];
    for (let k = 1; k <= 4; k++) {
      const shouldSkip = Math.random() > 0.2;
      const isSubmitted = Math.random() > 0.2;
      periodScores.push({
        id: `p-0${k}`,
        name: getPeriodName(k - 1),
        score: isSubmitted ? (shouldSkip ? Math.floor(Math.random() * 10) : undefined) : undefined,
        isSubmitted: isSubmitted,
      });
    }
    activities.push({
      id: `a-0${i}`,
      periodScores: periodScores,
    });
  }
  return activities;
};

export default {
  title: 'leemons/Scores/ScoresReviewerTable',
  parameters: {
    component: ScoresReviewerTable,
    design: {
      type: 'figma',
    },
  },
  argTypes: {
    onChange: { action: 'onChange' },
    onDataChange: { action: 'onDataChange' },
  },
};

const Template = ({ useLetters, grades, ...props }) => {
  const gradesToUse = useLetters
    ? grades
    : grades.map(({ number }) => {
        return { number };
      });
  return <ScoresReviewerTable {...props} grades={gradesToUse} />;
};

export const Playground = Template.bind({});

Playground.args = {
  ...SCORES_REVIEWER_TABLE_DEFAULT_PROPS,
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
  // grades: [
  //   {
  //     number: 0,
  //     letter: 'F',
  //   },
  //   {
  //     number: 1,
  //     letter: 'D-',
  //   },
  //   {
  //     number: 2,
  //     letter: 'D',
  //   },
  //   {
  //     number: 3,
  //     letter: 'D+',
  //   },
  //   {
  //     number: 4,
  //     letter: 'C-',
  //   },
  //   {
  //     number: 5,
  //     letter: 'C',
  //   },
  //   {
  //     number: 6,
  //     letter: 'C+',
  //   },
  //   {
  //     number: 7,
  //     letter: 'B-',
  //   },
  //   {
  //     number: 8,
  //     letter: 'B',
  //   },
  //   {
  //     number: 9,
  //     letter: 'B+',
  //   },
  //   {
  //     number: 10,
  //     letter: 'A-',
  //   },
  // ],
  subjects: [
    {
      id: 'a-01',
      name: 'Geografia e Historia',
      group: '1001',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Globe_icon_2.svg',
      color: 'green',
      periods: [
        {
          id: 'p-01',
          name: '1st',
        },
        {
          id: 'p-02',
          name: '2nd',
        },
        {
          id: 'p-03',
          name: '3th',
        },
        {
          id: 'p-04',
          name: 'Final',
          allowChange: true,
        },
      ],
    },
    {
      id: 'a-02',
      name: 'Frances',
      group: '5902',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/White_flag_icon.svg',
      color: 'red',
      periods: [
        {
          id: 'p-01',
          name: '1st',
        },
        {
          id: 'p-02',
          name: '2nd',
        },
        {
          id: 'p-03',
          name: '3th',
        },
        {
          id: 'p-04',
          name: 'Final',
          allowChange: true,
          weight: 0.8,
        },
      ],
    },
    {
      id: 'a-03',
      name: 'Computer Science',
      group: '3107',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Sideways_Arrow_Icon.svg',
      color: 'purple',
      periods: [
        {
          id: 'p-01',
          name: '1st',
        },
        {
          id: 'p-02',
          name: '2nd',
        },
        {
          id: 'p-03',
          name: '3th',
        },
        {
          id: 'p-04',
          name: 'Final',
          allowChange: true,
        },
      ],
    },
  ],
  value: [
    {
      id: 's-01',
      name: 'Michael',
      surname: 'Scott',
      image: 'https://areajugones.sport.es/wp-content/uploads/2021/05/the-office-2.jpg',
      subjects: generateRandomSubjects(),
      customScore: 8.73,
      allowCustomChange: true,
    },
    {
      id: 's-02',
      name: 'Dwight',
      surname: 'Schrute',
      image: 'https://pbs.twimg.com/profile_images/1434184964866723852/M5c8uqF7_400x400.jpg',
      subjects: generateRandomSubjects(),
      allowCustomChange: true,
    },
    {
      id: 's-03',
      name: 'Jim',
      surname: 'Halpert',
      image:
        'https://en.meming.world/images/en/thumb/6/6d/Jim_Halpert_Smiling_Through_Blinds.jpg/300px-Jim_Halpert_Smiling_Through_Blinds.jpg',
      subjects: generateRandomSubjects(),
      allowCustomChange: true,
    },
    {
      id: 's-04',
      name: 'Pam',
      surname: 'Beesly',
      image:
        'https://gcdn.lanetaneta.com/wp-content/uploads/2019/09/The-Office-10-veces-que-Pam-recibió-un-trato-mucho-780x405.jpg',
      subjects: generateRandomSubjects(),
      allowCustomChange: true,
    },
    {
      id: 's-05',
      name: 'Ryan',
      surname: 'Howard',
      image:
        'https://vader.news/__export/1616206384907/sites/gadgets/img/2021/03/19/ryan_howard.jpg_1962491361.jpg',
      subjects: generateRandomSubjects(),
      allowCustomChange: true,
    },
    {
      id: 's-06',
      name: 'Kelly',
      surname: 'Kapoor',
      subjects: generateRandomSubjects(),
      allowCustomChange: true,
    },
    {
      id: 's-07',
      name: 'Angela',
      surname: 'Martin',
      subjects: generateRandomSubjects(),
      allowCustomChange: true,
    },
    {
      id: 's-08',
      name: 'Oscar',
      surname: 'Martinez',
      image: 'https://poptv.orange.es/wp-content/uploads/sites/3/2020/08/oscar-nuncc83ez.jpeg',
      subjects: generateRandomSubjects(),
      allowCustomChange: true,
    },
    {
      id: 's-09',
      name: 'Phyllis',
      surname: 'Lapin',
      image: 'https://cinematicos.net/wp-content/uploads/l-intro-1624653656.jpg',
      subjects: generateRandomSubjects(),
      allowCustomChange: true,
    },
    {
      id: 's-10',
      name: 'Stanley',
      surname: 'Hudson',
      image: 'https://www.cinepremiere.com.mx/wp-content/uploads/2020/07/stanley-the-office.jpg',
      subjects: generateRandomSubjects(),
      allowCustomChange: true,
    },
    {
      id: 's-11',
      name: 'Meredith',
      surname: 'Palmer',
      subjects: generateRandomSubjects(),
      allowCustomChange: true,
    },
  ],
};
