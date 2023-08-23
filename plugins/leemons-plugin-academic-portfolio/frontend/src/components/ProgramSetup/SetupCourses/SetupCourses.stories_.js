import React from 'react';
import { SETUP_COURSES_DEFAULT_PROPS, SetupCourses } from './SetupCourses';
import mdx from './SetupCourses.mdx';
import { COURSES_DATA } from '../mocks/data';

export default {
  title: 'leemons/AcademicPortfolio/Setup/Courses',
  parameters: {
    component: SetupCourses,
    docs: {
      page: mdx
    },
    design: {
      type: 'figma'
      //url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    }
  },
  argTypes: {
    onPrevious: { action: 'onPrevious' },
    onNext: { action: 'onNext' }
  }
};

const Template = ({ ...props }) => {
  return <SetupCourses {...props} editable={true} />;
};

export const Playground = Template.bind({});

Playground.args = {
  ...SETUP_COURSES_DEFAULT_PROPS,
  ...COURSES_DATA
};
