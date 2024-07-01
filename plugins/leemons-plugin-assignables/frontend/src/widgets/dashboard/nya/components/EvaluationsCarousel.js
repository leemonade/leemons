import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@bubbles-ui/components';
import { Swiper } from '@bubbles-ui/extras';
import { EmptyState } from '@assignables/widgets/dashboard/nya';
import { useNyaStyles } from '../hooks';
import EvaluationCardStudent from './EvaluationCardStudent';

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
    slidesPerView: 'auto',
    spaceBetween: 24,
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
        <EvaluationCardStudent
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
