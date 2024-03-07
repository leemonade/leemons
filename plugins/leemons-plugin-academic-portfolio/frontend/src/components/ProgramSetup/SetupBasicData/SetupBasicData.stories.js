import React from 'react';
import { SetupBasicData, SETUP_BASIC_DATA_DEFAULT_PROPS } from './SetupBasicData';
import { Box } from '@bubbles-ui/components';
import { BASIC_DATA } from '../mocks/data';

export default {
  title: 'leemons/AcademicPortfolio/Setup/BasicData',
  parameters: {
    component: SetupBasicData,

    design: {
      type: 'figma',
    },
  },
  argTypes: {
    onNext: { action: 'onNext' },
  },
};

const Template = ({ ...props }) => {
  return (
    <Box style={{ width: 560 }}>
      <SetupBasicData {...props} />
    </Box>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  ...SETUP_BASIC_DATA_DEFAULT_PROPS,
  ...BASIC_DATA,
};
