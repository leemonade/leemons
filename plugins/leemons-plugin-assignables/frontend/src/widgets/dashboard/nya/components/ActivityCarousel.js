import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, Loader } from '@bubbles-ui/components';
import { useLocation } from 'react-router-dom';
import NYACard from '../../../../components/NYACard';
import EmptyState from './EmptyState';
import { useNyaStyles } from '../hooks';

export default function ActivityCarousel({
  localizations,
  activities,
  count,
  isLoading,
  classData,
}) {
  const { theme } = useNyaStyles();
  const location = useLocation();
  const isStudentDashboard = location.pathname.includes('private/dashboard/class');

  const swiperProps = {
    watchOverflow: true,
    selectable: true,
    deselectable: false,
    disableSelectedStyles: true,
    slidesPerView: 'auto',
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
        slidesPerView: 5,
        spaceBetween: theme.spacing[4],
      },
    },
    slideStyles: {
      height: 'auto',
      paddingTop: '24px',
      paddingBottom: '24px',
      minWidth: '264px !important',
      maxWidth: '320px !important',
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
          showSubject={!isStudentDashboard}
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
