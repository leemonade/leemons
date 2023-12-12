import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@bubbles-ui/components';
import { Swiper } from '@bubbles-ui/extras';
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
    spaceBetween: 60,
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
      maxWidth: '532px',
      minWidth: '532px',
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
