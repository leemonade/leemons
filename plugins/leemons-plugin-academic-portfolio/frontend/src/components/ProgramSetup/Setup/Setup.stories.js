import React from 'react';
import { Box } from '@bubbles-ui/components';
import { Setup, SETUP_DEFAULT_PROPS } from './Setup';
import {
  AcademicProgramSetupBasicData,
  AcademicProgramSetupCourses,
  AcademicProgramSetupSubjects,
} from '../';
import { BASIC_DATA, COURSES_DATA, INIT_VALUES, SUBJECTS_DATA } from '../mocks/data';

export default {
  title: 'leemons/AcademicPortfolio',
  parameters: {
    component: Setup,
    design: {
      type: 'figma',
    },
  },
  argTypes: {
    onNext: { action: 'next' },
    onPrev: { action: 'previous' },
    onSave: { action: 'save' },
  },
};

const Template = ({ ...props }) => {
  return (
    <Box style={{ width: 560 }}>
      <Setup {...props} />
    </Box>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  ...SETUP_DEFAULT_PROPS,
  labels: { title: 'Setup', buttonSave: 'Save changes' },
  data: [
    {
      label: 'Basic data',
      content: <AcademicProgramSetupBasicData {...BASIC_DATA} />,
    },
    {
      label: 'Courses',
      content: <AcademicProgramSetupCourses {...COURSES_DATA} />,
    },
    {
      label: 'Subjects',
      content: <AcademicProgramSetupSubjects {...SUBJECTS_DATA} />,
    },
  ],
  values: INIT_VALUES,
};
