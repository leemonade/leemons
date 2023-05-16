import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, Loader } from '@bubbles-ui/components';
import EmptyState from './EmptyState';
import { useNyaStyles } from '../hooks';
import EvaluationCard from './EvaluationCard';

export default function EvaluationsCarousel({
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
    return <EmptyState label={localizations?.evaluationsEmptyState} />;
  }

  return (
    <Swiper {...swiperProps}>
      {activities.map((activity, i) => (
        <EvaluationCard
          key={activity.id}
          assignation={activity}
          showSubject={showSubjects}
          classData={classData[i]?.data}
        />
      ))}
    </Swiper>
  );
}

EvaluationsCarousel.propTypes = {
  localizations: PropTypes.object,
  activities: PropTypes.array,
  count: PropTypes.number,
  isLoading: PropTypes.bool,
  showSubjects: PropTypes.bool,
  classData: PropTypes.array,
};
