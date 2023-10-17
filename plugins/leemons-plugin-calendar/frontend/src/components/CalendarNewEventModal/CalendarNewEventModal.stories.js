import React, { useEffect } from 'react';
import { Box, Button } from '@bubbles-ui/components';
import { CalendarNewEventModal } from './CalendarNewEventModal';
import { CALENDAR_NEW_EVENT_MODAL_DEFAULT_PROPS } from './CalendarNewEventModal.constants';

export default {
  title: 'leemons/Calendar/CalendarNewEventModal',
  parameters: {
    component: CalendarNewEventModal,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    onSubmit: { action: 'onSubmit' },
    // myBooleanProp: { control: { type: 'boolean' } },
    // mySelectProp: { options: ['Hello', 'World'], control: { type: 'select' } },
  },
};

const Template = ({ opened, ...props }) => {
  const [_opened, setOpened] = React.useState(false);

  useEffect(() => {
    setOpened(opened);
  }, [opened]);

  return (
    <Box style={{ display: 'flex', justifyContent: 'center' }}>
      <CalendarNewEventModal
        opened={_opened}
        onClose={() => setOpened(false)}
        target={<Button onClick={() => setOpened(!_opened)}>Open modal</Button>}
        {...props}
      />
    </Box>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  ...CALENDAR_NEW_EVENT_MODAL_DEFAULT_PROPS,
  labels: {
    periodName: 'Period name',
    schoolDays: 'School days',
    nonSchoolDays: 'Non school days',
    withoutOrdinaryDays: 'Without ordinary days',
    startDate: 'Start date',
    endDate: 'End date',
    color: 'Color',
    add: 'Add',
  },
  placeholders: {
    periodName: 'Final exams',
    startDate: 'Select a start date',
    endDate: 'Select an end date',
    color: 'Select a color',
  },
  errorMessages: {
    periodName: 'Field required',
    dayType: 'Field required',
    startDate: 'Field required',
    endDate: 'Field required',
    color: 'Field required',
    invalidColor: 'Invalid color',
  },
  suggestions: ['Semana de la ciencia', 'Día del león'],
};
