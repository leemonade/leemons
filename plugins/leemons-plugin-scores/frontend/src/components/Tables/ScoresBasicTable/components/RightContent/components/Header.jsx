import { Box, createStyles, Text } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { getActivitiesPeriod } from '../../../helpers/getActivitiesPeriod';

import ColumnHeader from './ColumnHeader';

const useRightContentHeaderStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  console.log('globalTheme', globalTheme);
  return {
    root: {
      height: 120,
      borderBottom: '2px solid #F2F2F2',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingTop: globalTheme.spacing.padding.xlslg,
      paddingLeft: globalTheme.spacing.padding.xsm,
      paddingRight: globalTheme.spacing.padding.xsm,
    },
    topPart: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: globalTheme.spacing.gap.sm,
    },
    bottomPart: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: globalTheme.spacing.gap.sm,
      minWidth: '100%',
      '> *': {
        flex: 1,
        textAlign: 'center',
      },
    },
  };
});

export function RightContentHeader({ labels, periodName, from, to, locale, hideCustom }) {
  const { classes } = useRightContentHeaderStyles(
    {},
    { name: 'ScoresBasicTableRightContentHeader' }
  );

  return (
    <Box className={classes.root}>
      <Box className={classes.topPart}>
        <Text color="primary" role="productive" stronger transform="uppercase">
          {labels.avgScore}
        </Text>
        <Text color="primary" role="productive" size="xs">
          {getActivitiesPeriod({ periodName, from, to, locale })}
        </Text>
      </Box>
      <Box className={classes.bottomPart}>
        <ColumnHeader label={labels.gradingTasks} />
        <ColumnHeader label={labels.retake + ' TEST 1'} />
        <ColumnHeader label={labels.retake + ' TEST 2'} />
        {!hideCustom && <ColumnHeader label={labels.customScore} />}
      </Box>
    </Box>
  );
}

RightContentHeader.propTypes = {
  labels: PropTypes.object.isRequired,
  periodName: PropTypes.string,
  from: PropTypes.string,
  to: PropTypes.string,
  locale: PropTypes.string,
  hideCustom: PropTypes.bool,
};
