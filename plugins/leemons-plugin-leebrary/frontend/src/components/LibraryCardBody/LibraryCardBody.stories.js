/* eslint-disable react/prop-types */
import React from 'react';
import { Box } from '@bubbles-ui/components';
import { LibraryCardBody } from './LibraryCardBody';
import { LIBRARY_CARD_BODY_DEFAULT_PROPS } from './LibraryCardBody.constants';
import { LIBRARYCARD_VARIANTS } from '../LibraryCard';
import { LIBRARYCARD_ASSIGMENT_ROLES } from '../Library.constants';

export default {
  title: 'leemons/Library/LibraryCardBody',
  parameters: {
    component: LibraryCardBody,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/c3MWm2gVHU4JfYlVfr5VvB/🍋💧-Bubbles-SD-v2',
    },
  },
  argTypes: {
    variant: { control: { type: 'select' }, options: LIBRARYCARD_VARIANTS },
    role: { control: { type: 'select' }, options: LIBRARYCARD_ASSIGMENT_ROLES },
    showDescription: { control: 'boolean' },
  },
};

const Template = ({
  children,
  description,
  assigment,
  showDescription,
  showAssigment,
  ...props
}) => (
  <Box style={{ width: 322, height: 300, border: '1px solid #B9BEC4', borderRadius: 8 }}>
    <LibraryCardBody
      {...props}
      description={showDescription ? description : null}
      assigment={showAssigment ? assigment : null}
    >
      {children}
    </LibraryCardBody>
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {
  showDescription: true,
  showAssigment: true,
  ...LIBRARY_CARD_BODY_DEFAULT_PROPS,
  name: 'El ritmo de la guerra',
  description:
    'This is a very large description of the book Rythim of War, the fourth book in The Stormlight Archive.',
  metadata: [
    { label: 'Quality', value: '128kb' },
    { label: 'Format', value: 'mp3' },
    { label: 'Duration', value: '10 min' },
    { label: 'Transcript', value: 'Not available' },
  ],
  tags: ['Fantasy', 'Adventure', 'Fiction'],
  published: true,

  assigment: {
    completed: 0.3,
    submission: 15,
    total: 24,
    subject: {
      name: 'Maths - 1025 - GB',
    },
    avgTime: 900,
    avgAttempts: 3,
    activityType: 'Tarea/Test',
    grade: 8.5,
  },
  subjects: [{ subject: 'id1' }, { subject: 'id2' }],
  program: 'ESO',
};
