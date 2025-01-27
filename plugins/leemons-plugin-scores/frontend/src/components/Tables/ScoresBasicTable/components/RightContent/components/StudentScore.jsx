import { Box, createStyles } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

const useStudentScoreStyles = createStyles((theme, { big }) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: globalTheme.spacing.padding.md,
      paddingBottom: globalTheme.spacing.padding.md,
      overflow: 'hidden',
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      flex: 1,
      minHeight: '100%',
      width: big ? 120 : 75,
      minWidth: big ? 120 : 75,
    },
  };
});

export function StudentScore({ children, big }) {
  const { classes } = useStudentScoreStyles({ big });

  return <Box className={classes.root}>{children}</Box>;
}

StudentScore.propTypes = {
  children: PropTypes.node,
  big: PropTypes.bool,
};
