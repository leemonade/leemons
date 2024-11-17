import React from 'react';
import { Box, FileIcon, COLORS } from '@bubbles-ui/components';
import { ArchiveIcon } from '@bubbles-ui/icons/solid';
import { LibraryCardCover } from './LibraryCardCover.1';
import { LIBRARY_CARD_COVER_DEFAULT_PROPS } from './LibraryCardCover.constants';
import { LIBRARYCARD_ASSIGMENT_ROLES } from '../Library.constants';

export default {
  title: 'leemons/Library/LibraryCardCover',
  parameters: {
    component: LibraryCardCover,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/c3MWm2gVHU4JfYlVfr5VvB/🍋💧-Bubbles-SD-v2',
    },
  },
  argTypes: {
    parentHovered: { control: 'boolean' },
    role: { control: { type: 'select' }, options: LIBRARYCARD_ASSIGMENT_ROLES },
  },
};

const Template = ({ children, showSubject, subject, ...props }) => (
  <Box style={{ width: 287, display: 'inline-block' }}>
    <LibraryCardCover {...props} subject={showSubject ? subject : undefined}>
      {children}
    </LibraryCardCover>
  </Box>
);

export const Playground = Template.bind({});

Playground.args = {
  ...LIBRARY_CARD_COVER_DEFAULT_PROPS,
  showSubject: true,
  fileIcon: <FileIcon fileType={'audio'} size={64} color={COLORS.text06} />,
  color: '#DC5571',
  name: 'El ritmo de la guerra',
  cover: 'https://uh.gsstatic.es/sfAttachPlugin/1029293.jpg',
  deadlineProps: {
    icon: <ArchiveIcon width={16} height={16} />,
    deadline: new Date('2022-02-20'),
    locale: 'es',
    isNew: false,
  },
  subject: {
    name: 'Bases para el análisis y el tratamiento de',
    color: '#FABADA',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Globe_icon_2.svg',
  },
  parentHovered: false,
  isNew: false,
  badge: '',
};
