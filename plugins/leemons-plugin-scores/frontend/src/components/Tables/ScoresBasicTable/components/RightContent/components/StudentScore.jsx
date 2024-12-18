import { Box, createStyles } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

const useStudentScoreStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 1,
      paddingTop: globalTheme.spacing.padding.md,
      paddingBottom: globalTheme.spacing.padding.md,
      overflow: 'hidden',
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      flex: 1,
      minHeight: '100%',
    },
  };
});

export function StudentScore({ children }) {
  const { classes } = useStudentScoreStyles();

  return <Box className={classes.root}>{children}</Box>;
}

StudentScore.propTypes = {
  children: PropTypes.node,
};
