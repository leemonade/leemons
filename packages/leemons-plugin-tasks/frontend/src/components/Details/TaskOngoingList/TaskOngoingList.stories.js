import React from 'react';
import { Box } from '@bubbles-ui/components';
import { TaskOngoingList } from './TaskOngoingList';
import { TASK_ONGOING_LIST_DEFAULT_PROPS } from './TaskOngoingList.constants';
import mdx from './TaskOngoingList.mdx';

export default {
  title: 'leemons/Pages/TaskOngoingList',
  parameters: {
    component: TaskOngoingList,
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
  return (
    <Box style={{ margin: -16 }}>
      <TaskOngoingList {...props} />
    </Box>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  ...TASK_ONGOING_LIST_DEFAULT_PROPS,
};
