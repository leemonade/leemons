import React from 'react';
import { Box } from '@bubbles-ui/components';
import { TaskOngoingDetail } from './TaskOngoingDetail';
import { TASK_ONGOING_DETAIL_DEFAULT_PROPS } from './TaskOngoingDetail.constants';
import mdx from './TaskOngoingDetail.mdx';

export default {
  title: 'leemons/Pages/TaskOngoingDetail',
  parameters: {
    component: TaskOngoingDetail,
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
  return <TaskOngoingDetail {...props} />;
};

export const Playground = Template.bind({});

Playground.args = {
  ...TASK_ONGOING_DETAIL_DEFAULT_PROPS,
};
