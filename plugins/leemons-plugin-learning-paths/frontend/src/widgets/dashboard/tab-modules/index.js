import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import useSearchOngoingActivities from '@assignables/requests/hooks/queries/useSearchOngoingActivities';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { Box, Swiper, createStyles, useTheme } from '@bubbles-ui/components';
import { Link } from 'react-router-dom';
// TODO: import from @library plugin
import useAssignationsByProfile from '@assignables/hooks/assignations/useAssignationsByProfile';
import NYACard from '@assignables/components/NYACard';

function useUserModules({ class: klass, program }) {
  const isTeacher = useIsTeacher();

  const { data: activities } = useSearchOngoingActivities({
    isTeacher,
    role: 'learningpaths.module',
    programs: JSON.stringify([program]),
    classes: JSON.stringify([klass]),
    isArchived: false,
    sort: 'assignation',
    offset: 0,
    limit: 10,
  });

  const modules = activities?.items;
  const { data: asignations, isLoading } = useAssignationsByProfile(modules);
  return { data: asignations, isLoading };
}

function useSwiperProps() {
  const theme = useTheme();
  return useMemo(
    () => ({
      selectable: true,
      deselectable: false,
      centeredSlides: true,
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
        paddingTop: '24px',
        paddingBottom: '24px',
        minWidth: '264px !important',
        maxWidth: '320px !important',
      },
    }),
    [theme]
  );
}

function ActivitiesCarousel({ modules }) {
  const swiperProps = useSwiperProps();
  return (
    <Swiper {...swiperProps}>
      {modules.map((module) => (
        <NYACard key={module.id} instance={module} showSubject={false} />
      ))}
    </Swiper>
  );
}

export const useModulesTabStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.gap.xlg,

      padding: globalTheme.spacing.padding['3xlg'],
      paddingTop: globalTheme.spacing.padding.xlg,
    },
  };
});

export default function ModulesTab({ classe: { id: klass, program } }) {
  const { data: modules, isLoading } = useUserModules({ class: klass, program });
  const { classes } = useModulesTabStyles();

  return (
    <Box className={classes.root}>{!isLoading && <ActivitiesCarousel modules={modules} />}</Box>
  );
}

ModulesTab.propTypes = {
  classe: PropTypes.shape({
    id: PropTypes.string,
    program: PropTypes.string,
  }),
};
