/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react/prop-types */
import React from 'react';
import { Box } from '@bubbles-ui/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClassroomPicker } from './ClassroomPicker';
import { classesDataMock } from './mock/classesDataMock';

export default {
  title: 'leemons/AcademicPortfolio/ClassroomPicker',
  parameters: {
    component: ClassroomPicker,
    design: {
      type: 'figma',
    },
  },
  // argTypes: {
  //   testMultiSubject: { control: 'boolean' },
  // },
};

const queryClient = new QueryClient();

const Template = ({ programId, data }) => (
  <QueryClientProvider client={queryClient}>
    <Box>
      <ClassroomPicker programId={programId} data={data} />
    </Box>
  </QueryClientProvider>
);
export const Playground = Template.bind({});

Playground.args = {
  programId: '1',
  data: classesDataMock,
};
