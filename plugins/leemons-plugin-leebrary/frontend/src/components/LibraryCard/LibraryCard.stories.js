/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable react/prop-types */
import React from 'react';
import { Box, Paper, ImageLoader } from '@bubbles-ui/components';
import { ArchiveIcon, StarIcon, DeleteBinIcon, FlagIcon } from '@bubbles-ui/icons/solid';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LibraryCard } from './LibraryCard';
import { LIBRARY_CARD_DEFAULT_PROPS, LIBRARYCARD_VARIANTS } from './LibraryCard.constants';
import { LIBRARYCARD_ASSIGMENT_ROLES } from '../Library.constants';
import { AUDIO_ASSET, URL_ASSET, CURRICULUM_ASSET } from './mock/data';

const queryClient = new QueryClient();

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
    testShowImage: { control: 'boolean' },
    testShowTitle: { control: 'boolean' },
    variant: { control: { type: 'select' }, options: LIBRARYCARD_VARIANTS },
    role: { control: { type: 'select' }, options: LIBRARYCARD_ASSIGMENT_ROLES },
    onAction: { action: 'onAction' },
    testIsDraft: { control: 'boolean' },
  },
};

const Template = ({
  testShowImage,
  testShowDescription,
  testShowAction,
  testShowAssigment,
  testShowSubject,
  testShowTitle,
  children,
  asset,
  assigment,
  deadlineProps,
  variant,
  action,
  subject,
  testIsDraft,
  ...props
}) => {
  const isBookmark = variant === 'bookmark';
  const isCurriculum = variant === 'curriculum';

  const assetToRender = {
    cover: testShowImage ? (isBookmark ? URL_ASSET.cover : asset.cover) : undefined,
    description: testShowDescription ? asset.description : undefined,
    name: testShowTitle ? asset.name : undefined,
  };

  const assetChecker = {
    [`${isCurriculum}`]: { CURRICULUM_ASSET },
    [`${isBookmark}`]: { ...URL_ASSET, ...assetToRender },
    [`${!isBookmark && !isCurriculum}`]: { ...asset, ...assetToRender },
  };
  if (testIsDraft) {
    asset.published = false;
  } else {
    asset.published = true;
  }

  return (
    <Paper color="solid" style={{ width: 322, height: 600 }}>
      <QueryClientProvider client={queryClient}>
        <LibraryCard
          {...props}
          // eslint-disable-next-line dot-notation
          asset={assetChecker['true']}
          deadlineProps={isCurriculum ? null : deadlineProps}
          assigment={!isCurriculum && testShowSubject ? assigment : null}
          variant="document"
          action={testShowAction ? action : undefined}
          subject={testShowSubject ? subject : undefined}
          variantIcon={
            <Box style={{ position: 'relative', width: 14, height: 14 }}>
              <ImageLoader src={`/img/library/tasks.svg`} width={14} height={14} />
            </Box>
          }
        />
      </QueryClientProvider>
    </Paper>
  );
};

export const Playground = Template.bind({});

Playground.args = {
  testShowImage: true,
  testShowDescription: true,
  testShowAction: true,
  testShowAssigment: true,
  testShowSubject: true,
  testIsDraft: true,
  testShowTitle: true,
  variant: 'media',
  action: 'View feedback',
  badge: '',
  ...LIBRARY_CARD_DEFAULT_PROPS,
  asset: {
    ...AUDIO_ASSET,
    subjects: {
      name: 'Lengua Castellana y Literatura de España',
      color: '#FABADA',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Globe_icon_2.svg',
    },
    program: 'ESO',
  },
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
