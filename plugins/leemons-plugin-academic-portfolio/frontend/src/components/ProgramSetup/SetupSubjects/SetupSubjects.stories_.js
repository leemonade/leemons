import React from 'react';
import { SetupSubjects, SETUP_SUBJECTS_DEFAULT_PROPS } from './SetupSubjects';
import mdx from './SetupSubjects.mdx';
import { SUBJECTS_DATA } from '../mocks/data';

export default {
  title: 'leemons/AcademicPortfolio/Setup/Subjects',
  parameters: {
    component: SetupSubjects,
    docs: {
      page: mdx,
    },
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    onNext: { action: 'onNext' },
    onPrevious: { action: 'onPrevious' },
    // myBooleanProp: { control: { type: 'boolean' } },
    // mySelectProp: { options: ['Hello', 'World'], control: { type: 'select' } },
  },
};

const Template = ({ ...props }) => {
  return <SetupSubjects {...props} />;
};

export const Playground = Template.bind({});

Playground.args = {
  ...SETUP_SUBJECTS_DEFAULT_PROPS,
  ...SUBJECTS_DATA,
};
