/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/prop-types */
import React from 'react';
import { Box } from '@bubbles-ui/components';
import { SubjectItemDisplay } from './SubjectItemDisplay';

export default {
  title: 'leemons/AcademicPortfolio/SubjectItemDisplay',
  parameters: {
    component: SubjectItemDisplay,
    design: {
      type: 'figma',
    },
  },
  argTypes: {
    testMultiSubject: { control: 'boolean' },
  },
};

const Template = ({ testMultiSubject }, props) => {
  const [isMultiSubject, setIsMultiSubject] = React.useState(false);

  const subjectsIdsMulti = [
    {
      icon: 'https://github.com/leemonade/leemons/assets/27650532/81587829-c4b1-4c1a-b342-e8f24d0bd2a4',
      name: 'Lengua y Literatura 1',
      color: 'red',
    },
    {
      icon: 'https://github.com/leemonade/leemons/assets/27650532/81587829-c4b1-4c1a-b342-e8f24d0bd2a4',
      name: 'Lengua y Literatura 1',
      color: 'red',
    },
    {
      icon: 'https://github.com/leemonade/leemons/assets/27650532/81587829-c4b1-4c1a-b342-e8f24d0bd2a4',
      name: 'Lengua y Literatura 1',
      color: 'red',
    },
  ];
  if (testMultiSubject) {
    setIsMultiSubject(subjectsIdsMulti);
  } else {
    setIsMultiSubject(props.subjectsIds);
  }
  return (
    <Box>
      <SubjectItemDisplay {...isMultiSubject} />
    </Box>
  );
};
export const Playground = Template.bind({});

Playground.args = {
  subjectsIds: {
    icon: 'https://github.com/leemonade/leemons/assets/27650532/81587829-c4b1-4c1a-b342-e8f24d0bd2a4',
    name: 'Lengua y Literatura 1',
    color: 'red',
  },
  testMultiSubject: false,
};
