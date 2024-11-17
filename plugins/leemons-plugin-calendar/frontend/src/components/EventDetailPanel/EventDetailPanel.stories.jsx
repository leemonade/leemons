import React from 'react';
import { Box, Button, Stack } from '@bubbles-ui/components';
import { EventDetailPanel } from './EventDetailPanel';
import { EVENT_DETAIL_PANEL_DEFAULT_PROPS } from './EventDetailPanel.constants';

export default {
  title: 'leemons/Calendar/EventDetailPanel',
  parameters: {
    component: EventDetailPanel,
    design: {
      type: 'figma',
      // url: 'https://www.figma.com/file/kcSXz3QZFByFDTumNgzPpV/?node-id=2962%3A31342',
    },
  },
  argTypes: {
    onClose: { action: 'onClose' },
    onControl: { action: 'onControl' },
  },
};

const Template = ({ onClose, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <>
      <EventDetailPanel
        {...props}
        opened={isOpen}
        onClose={() => {
          setIsOpen(false);
          onClose();
        }}
      />
      <Stack fullWidth justifyContent="center">
        <Box>
          <Button onClick={() => setIsOpen(true)}>Open Drawer</Button>
        </Box>
      </Stack>
    </>
  );
};

export const Playground = Template.bind({});

const nowDate = new Date();

Playground.args = {
  ...EVENT_DETAIL_PANEL_DEFAULT_PROPS,
  event: {
    title: 'Biology - 3002 - 3ºB  (Session 17)',
    dateRange: [new Date(nowDate), new Date(nowDate.setHours(nowDate.getHours() + 2))],
    period: 'Every week on working days',
    classGroup: '3º ESO - Group 3ºA',
    subject: {
      icon: 'http://localhost:8080/api/leebrary/img/bd0bfe67-1380-4e7c-a094-e6e6fd7d53f6@1.0.0?authorization=%5B%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uQ29uZmlnIjp7InByb2dyYW0iOiI2NGJmM2ZmZi1iZWQ3LTRlOTktYWMwOS0yYzA0YzRlZjcwOTkifSwidXNlckFnZW50IjoiYmMzOWMwNWEtYTEwOS00MzgwLWE5NTgtMWU5Njk5MmVhMmYxIiwiaWF0IjoxNjU2MDU1NzcxLCJleHAiOjE2NTYxNDIxNzF9.GRyDsSI20aW9PeaUm-jZ9nRkL_pU7TKbxb_h6MN3RPU%22%5D',
      name: 'Biology',
    },
    teacher: {
      image:
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
      name: 'Bruno',
      surnames: 'Petresky No se cuantos',
    },
    classroom: 'meet.google.com/rmh-tybs-cyp',
    location: '2nd Floor - Assembly Hall',
  },
  locale: 'en',
  labels: {
    attendanceControl: 'Control of attendace',
    mainTeacher: '(main teacher)',
  },
};
