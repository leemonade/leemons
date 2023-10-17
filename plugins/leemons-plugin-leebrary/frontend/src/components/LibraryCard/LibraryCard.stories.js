import React from 'react';
import { Box, Paper, ImageLoader } from '@bubbles-ui/components';
import { ArchiveIcon, StarIcon, DeleteBinIcon, FlagIcon } from '@bubbles-ui/icons/solid';
import { LibraryCard } from './LibraryCard';
import { LIBRARY_CARD_DEFAULT_PROPS, LIBRARYCARD_VARIANTS } from './LibraryCard.constants';
import { LIBRARYCARD_ASSIGMENT_ROLES } from '../Library.constants';
import { AUDIO_ASSET, URL_ASSET, CURRICULUM_ASSET } from './mock/data';

export default {
  title: 'leemons/Library/LibraryCard',
  parameters: {
    component: LibraryCard,
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/c3MWm2gVHU4JfYlVfr5VvB/🍋💧-Bubbles-SD-v2',
    },
  },
  argTypes: {
    showImage: { control: 'boolean' },
    variant: { control: { type: 'select' }, options: LIBRARYCARD_VARIANTS },
    role: { control: { type: 'select' }, options: LIBRARYCARD_ASSIGMENT_ROLES },
    onAction: { action: 'onAction' },
  },
};

const Template = ({
  showImage,
  showDescription,
  showAction,
  showAssigment,
  showSubject,
  children,
  asset,
  assigment,
  deadlineProps,
  variant,
  action,
  subject,
  ...props
}) => {
  const isBookmark = variant === 'bookmark';
  const isCurriculum = variant === 'curriculum';

  const assetToRender = {
    cover: showImage ? (isBookmark ? URL_ASSET.cover : asset.cover) : undefined,
    description: showDescription ? asset.description : undefined,
  };

  return (
    <Paper color="solid" style={{ width: 322, height: 600 }}>
      <LibraryCard
        {...props}
        asset={
          isCurriculum
            ? CURRICULUM_ASSET
            : isBookmark
            ? { ...URL_ASSET, ...assetToRender }
            : { ...asset, ...assetToRender, cover: null }
        }
        deadlineProps={isCurriculum ? null : deadlineProps}
        assigment={!isCurriculum && showAssigment ? assigment : null}
        variant="document"
        action={showAction ? action : undefined}
        subject={showSubject ? subject : undefined}
        variantIcon={
          <Box style={{ position: 'relative', width: 14, height: 14 }}>
            <ImageLoader src={`/img/library/tasks.svg`} width={14} height={14} />
          </Box>
        }
      />
    </Paper>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  showImage: true,
  showDescription: true,
  showAction: false,
  showAssigment: true,
  showSubject: true,
  variant: 'media',
  action: 'View feedback',
  badge: '',
  ...LIBRARY_CARD_DEFAULT_PROPS,
  asset: AUDIO_ASSET,
  assigment: {
    completed: 0.3,
    submission: 15,
    total: 24,
    subject: {
      name: 'Maths - 1025 - GB',
    },
    avgTime: 933,
    avgAttempts: 3,
    activityType: 'Tarea/Test',
    grade: 8.5,
  },
  deadlineProps: {
    icon: <ArchiveIcon width={16} height={16} />,
    deadline: new Date('2022-02-20'),
    locale: 'es',
    labels: {
      new: 'New',
      deadline: 'Deadline',
    },
  },
  subject: {
    name: 'Bases para el análisis y el tratamiento de',
    color: '#FABADA',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Globe_icon_2.svg',
  },
  menuItems: [
    {
      icon: <StarIcon />,
      children: 'Item 1',
      onClick: () => alert('Item 1 clicked'),
    },
    {
      icon: <DeleteBinIcon />,
      children: 'Item 2',
      onClick: () => alert('Item 1 clicked'),
    },
    {
      icon: <FlagIcon />,
      children: 'Item 3',
      onClick: () => alert('Item 3 clicked'),
    },
  ],
};
