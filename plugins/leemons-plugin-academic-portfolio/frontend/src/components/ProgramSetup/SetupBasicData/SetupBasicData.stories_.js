import React from 'react';
import { SetupBasicData, SETUP_BASIC_DATA_DEFAULT_PROPS } from './SetupBasicData';
import mdx from './SetupBasicData.mdx';
import { BASIC_DATA } from '../mocks/data';

export default {
  title: 'leemons/AcademicPortfolio/Setup/BasicData',
  parameters: {
    component: SetupBasicData,
    docs: {
      page: mdx,
    },
    design: {
      type: 'figma',
    },
  },
  argTypes: {
    onNext: { action: 'onNext' },
  },
};

const Template = ({ ...props }) => {
  return <SetupBasicData {...props} />;
};

export const Playground = Template.bind({});

Playground.args = {
  ...SETUP_BASIC_DATA_DEFAULT_PROPS,
  ...BASIC_DATA,
};
