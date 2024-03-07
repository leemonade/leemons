import React from 'react';
import { SetupSubjects, SETUP_SUBJECTS_DEFAULT_PROPS } from './SetupSubjects';
import { Box } from '@bubbles-ui/components';
import { SUBJECTS_DATA } from '../mocks/data';

export default {
  title: 'leemons/AcademicPortfolio/Setup/Subjects',
  parameters: {
    component: SetupSubjects,

    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    onNext: { action: 'onNext' },
    onPrevious: { action: 'onPrevious' },
  },
};

const Template = ({ ...props }) => {
  return (
    <Box style={{ width: 560 }}>
      <SetupSubjects {...props} />
    </Box>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  ...SETUP_SUBJECTS_DEFAULT_PROPS,
  ...SUBJECTS_DATA,
};
