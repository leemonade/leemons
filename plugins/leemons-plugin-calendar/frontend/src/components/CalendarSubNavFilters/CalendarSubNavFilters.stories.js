import React from 'react';
import {
  CALENDAR_SUB_NAV_FILTERS_DEFAULT_PROPS,
  CalendarSubNavFilters,
} from './CalendarSubNavFilters';
import { mock } from './mock/mock';

export default {
  title: 'Leemons/Calendar/CalendarSubNavFilters',
  parameters: {
    component: CalendarSubNavFilters,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    // myBooleanProp: { control: { type: 'boolean' } },
    // mySelectProp: { options: ['Hello', 'World'], control: { type: 'select' } },
  },
};

const Template = ({ children, ...props }) => {
  const [state, setState] = React.useState(mock);
  return (
    <CalendarSubNavFilters
      {...props}
      value={state}
      onChange={setState}
      centers={[
        { label: 'Center 1', value: '1' },
        { label: 'Center 2', value: '2' },
      ]}
      centerValue={1}
    >
      {children}
    </CalendarSubNavFilters>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  // myBooleanProp: false,
  // mySelectProp: 'Hello'
  ...CALENDAR_SUB_NAV_FILTERS_DEFAULT_PROPS,
};
