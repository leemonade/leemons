import { Box, createStyles } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { RightContentBody } from './components/Body';
import { RightContentHeader } from './components/Header';

const useRightContentStyles = createStyles((theme, { overFlowRight }) => ({
  root: {
    position: 'sticky',
    right: 0,
    backgroundColor: theme.colors.mainWhite,
    minWidth: '300px',
    boxShadow:
      overFlowRight &&
      '-16px 0px 16px rgba(35, 43, 60, 0.05), -50px 0px 30px rgba(51, 63, 86, 0.03)',
    transition: 'box-shadow 0.2s ease-in-out',
  },
}));

export function RightContent({
  labels,
  overFlowRight,
  headerProps,
  studentsData,
  grades,
  activities,
  useNumbers,
}) {
  const { classes } = useRightContentStyles(
    { overFlowRight },
    { name: 'ScoresBasicTableRightContent' }
  );
  return (
    <Box className={classes.root}>
      <RightContentHeader {...headerProps} labels={labels} />
      <RightContentBody
        studentsData={studentsData}
        grades={grades}
        activities={activities}
        useNumbers={useNumbers}
      />
    </Box>
  );
}

RightContent.propTypes = {
  labels: PropTypes.object.isRequired,
  headerProps: PropTypes.object.isRequired,
  overFlowRight: PropTypes.bool,
  studentsData: PropTypes.object.isRequired,
  grades: PropTypes.array.isRequired,
  activities: PropTypes.array.isRequired,
  useNumbers: PropTypes.bool.isRequired,
};
