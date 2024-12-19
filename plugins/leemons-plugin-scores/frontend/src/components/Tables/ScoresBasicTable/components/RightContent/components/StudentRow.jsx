import { Box, createStyles } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { ScoreCell } from '../../../ScoreCell';

import { StudentScore } from './StudentScore';

const useStudentRowStyles = createStyles((theme) => ({
  root: {
    borderBottom: `1px solid #F2F2F2`,
    height: 47,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
}));

export function StudentRow({
  id,
  activities,
  customScore,
  allowCustomChange,
  grades,
  avgScore,
  retakes,
  onDataChange,
  usePercentage,
  viewOnly,
}) {
  const { classes } = useStudentRowStyles();
  return (
    <Box className={classes.root}>
      <StudentScore>{avgScore}</StudentScore>
      {retakes.map((retake) => (
        <StudentScore key={retake.id}>
          <ScoreCell
            value={isNaN(customScore) ? 8 : customScore}
            allowChange={allowCustomChange && !viewOnly}
            grades={grades}
            usePercentage={usePercentage}
            row={id}
            column={`retake-${retake.index}`}
            onDataChange={onDataChange}
            isCustom={true}
          />
        </StudentScore>
      ))}
      <StudentScore>
        <ScoreCell
          value={isNaN(customScore) ? 8 : customScore}
          allowChange={allowCustomChange && !viewOnly}
          grades={grades}
          usePercentage={usePercentage}
          row={id}
          column={'customScore'}
          onDataChange={onDataChange}
          isCustom={true}
        />
      </StudentScore>
    </Box>
  );
}

StudentRow.propTypes = {
  id: PropTypes.string,
  activities: PropTypes.array,
  customScore: PropTypes.number,
  allowCustomChange: PropTypes.bool,
  grades: PropTypes.array,
  avgScore: PropTypes.number,
  retakes: PropTypes.array,
  onDataChange: PropTypes.func,
  usePercentage: PropTypes.bool,
  viewOnly: PropTypes.bool,
};
