import React from 'react';
import { LibraryCardContent } from './LibraryCardContent';
import { LIBRARY_CARD_CONTENT_DEFAULT_PROPS } from './LibraryCardContent.constants';
import { LIBRARYCARD_VARIANTS } from '../LibraryCard';
import { LIBRARYCARD_ASSIGMENT_ROLES } from '../Library.constants';

export default {
  title: 'leemons/Library/LibraryCardContent',
  parameters: {
    component: LibraryCardContent,
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
}) => {
  return (
    <LibraryCardContent
      {...props}
      description={showDescription ? description : null}
      assigment={showAssigment ? assigment : null}
    >
      {children}
    </LibraryCardContent>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  showDescription: true,
  showAssigment: true,
  ...LIBRARY_CARD_CONTENT_DEFAULT_PROPS,
  description:
    'This is a very large description of the book Rythim of War, the fourth book in The Stormlight Archive.',
  metadata: [
    { label: 'Quality', value: '128kb' },
    { label: 'Format', value: 'mp3' },
    { label: 'Duration', value: '10 min' },
    { label: 'Transcript', value: 'Not available' },
  ],
  tags: ['Fantasy', 'Adventure', 'Fiction'],
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
};
