import React from 'react';
import { useLocation } from 'react-router-dom';

import { Loader } from '@bubbles-ui/components';
import { Swiper } from '@bubbles-ui/extras';
import PropTypes from 'prop-types';

import NYACard from '../../../../components/NYACard';

import EmptyState from './EmptyState';

export default function ActivityCarousel({
  localizations,
  activities,
  count,
  isLoading,
  classData,
}) {
  const location = useLocation();
  const isStudentDashboard = location.pathname.includes('private/dashboard/class');

  const swiperProps = {
    slidesPerView: 'auto',
    spaceBetween: 24,
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
          showSubject={!isStudentDashboard}
          classData={classData}
          isActivityCarousel={true}
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
