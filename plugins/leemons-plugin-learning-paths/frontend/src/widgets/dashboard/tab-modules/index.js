import React from 'react';
import PropTypes from 'prop-types';
import useSearchOngoingActivities from '@assignables/requests/hooks/queries/useSearchOngoingActivities';
import { useIsTeacher } from '@academic-portfolio/hooks';
import { Box, createStyles } from '@bubbles-ui/components';
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
    activitiesList: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.gap.xlg,
      flexWrap: 'wrap',
    },
    activity: {
      minWidth: 329,
    },
  };
});

export default function ModulesTab({ classe: { id: klass, program } }) {
  const { data: modules, isLoading } = useUserModules({ class: klass, program });
  const { classes } = useModulesTabStyles();
  const isTeacher = useIsTeacher();

  return (
    <Box className={classes.root}>
      {!isLoading && (
        <Box className={classes.activitiesList}>
          {modules.map((module) => (
            <Box key={module.id} className={classes.activity}>
              <NYACard
                key={module.id}
                instance={module}
                showSubject={false}
                isTeacherSyllabus={isTeacher}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

ModulesTab.propTypes = {
  classe: PropTypes.shape({
    id: PropTypes.string,
    program: PropTypes.string,
  }),
};
