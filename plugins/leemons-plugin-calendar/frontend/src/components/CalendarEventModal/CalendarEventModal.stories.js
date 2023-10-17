import React from 'react';
import { Button } from '@bubbles-ui/components';
import { CALENDAR_EVENT_MODAL_DEFAULT_PROPS, CalendarEventModal } from './CalendarEventModal';
import { EVENT_DATA, eventTypeMock } from './mock/eventType';

export default {
  title: 'Leemons/Calendar/CalendarEventModal',
  parameters: {
    component: CalendarEventModal,
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
  const [opened, setOpened] = React.useState(true);
  return (
    <>
      <Button onClick={() => setOpened(true)}>Open</Button>
      <CalendarEventModal
        {...props}
        defaultValues={EVENT_DATA}
        onClose={() => setOpened(false)}
        opened={opened}
        isNew={false}
        selectData={{ ...CALENDAR_EVENT_MODAL_DEFAULT_PROPS.selectData, eventTypes: eventTypeMock }}
      >
        {children}
      </CalendarEventModal>
    </>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  // myBooleanProp: false,
  // mySelectProp: 'Hello'
  ...CALENDAR_EVENT_MODAL_DEFAULT_PROPS,
  defaultValues: { type: 'plugins.calendar.task' },
};
