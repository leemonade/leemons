import React from 'react';
import { KANBAN_FILTERS_DEFAULT_PROPS, KanbanFilters } from './KanbanFilters';

export default {
  title: 'Leemons/Kanban/KanbanFilters',
  parameters: {
    component: KanbanFilters,
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
  return (
    <KanbanFilters
      {...props}
      data={{
        calendars: [
          {
            value: 1,
            label: 'Calendario 1',
          },
        ],
      }}
    >
      {children}
    </KanbanFilters>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  // myBooleanProp: false,
  // mySelectProp: 'Hello'
  ...KANBAN_FILTERS_DEFAULT_PROPS,
};
