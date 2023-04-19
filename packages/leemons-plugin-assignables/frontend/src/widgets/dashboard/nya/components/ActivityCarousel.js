import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, Loader } from '@bubbles-ui/components';
import NYACard from '../../../../components/NYACard';
import EmptyState from './EmptyState';
import { useNyaStyles } from '../hooks';

export default function ActivityCarousel({
  localizations,
  activities,
  count,
  isLoading,
  showSubjects,
  classData,
}) {
  const { theme } = useNyaStyles();

  const swiperProps = {
    selectable: true,
    deselectable: false,
    disableSelectedStyles: true,
    breakAt: {
      [theme.breakpoints.xs]: {
        slidesPerView: 1,
        spaceBetween: theme.spacing[4],
      },
      [theme.breakpoints.sm]: {
        slidesPerView: 2,
        spaceBetween: theme.spacing[4],
      },
      [theme.breakpoints.lg]: {
        slidesPerView: 3,
        spaceBetween: theme.spacing[4],
      },
    },
    slideStyles: {
      height: 'auto',
    },
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!count) {
    return <EmptyState label={localizations?.activitiesEmptyState} />;
  }

  return (
    <Swiper {...swiperProps}>
      {activities.map((activity) => (
        <NYACard
          key={activity.id}
          instance={activity}
          showSubject={showSubjects}
          classData={classData}
        />
      ))}
    </Swiper>
  );
}

ActivityCarousel.propTypes = {
  localizations: PropTypes.object,
  activities: PropTypes.array,
  count: PropTypes.number,
  isLoading: PropTypes.bool,
  showSubjects: PropTypes.bool,
  classData: PropTypes.array,
};
