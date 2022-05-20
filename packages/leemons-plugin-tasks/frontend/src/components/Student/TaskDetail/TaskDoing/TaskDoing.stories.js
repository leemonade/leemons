import React from 'react';
import { Box } from '@bubbles-ui/components';
import { TaskDoing } from './TaskDoing';
import { TASK_DOING_DEFAULT_PROPS } from './TaskDoing.constants';
import mdx from './TaskDoing.mdx';

export default {
  title: 'leemons/Pages/TaskDoing',
  parameters: {
    component: TaskDoing,
    docs: {
      page: mdx,
    },
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {},
};

const Template = ({ ...props }) => {
  return <TaskDoing {...props} />;
};

export const Playground = Template.bind({});

Playground.args = {
  ...TASK_DOING_DEFAULT_PROPS,
};
