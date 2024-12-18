import { Box, createStyles } from '@bubbles-ui/components';

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

export function StudentRow({ activities, customScore, allowCustomChange, grades, avgScore }) {
  const { classes } = useStudentRowStyles();
  return (
    <Box className={classes.root}>
      <StudentScore>{avgScore}</StudentScore>
      <StudentScore>
        <ScoreCell
          value={isNaN(customScore) ? 8 : customScore}
          allowChange
          // allowChange={allowCustomChange && !viewOnly}
          grades={grades}
          //  usePercentage={usePercentage}
          //  row={id}
          column={'customScore'}
          //  onDataChange={onDataChange}
          isCustom={true}
        />
      </StudentScore>
      <StudentScore>
        <ScoreCell
          value={isNaN(customScore) ? 8 : customScore}
          allowChange
          // allowChange={allowCustomChange && !viewOnly}
          grades={grades}
          //  usePercentage={usePercentage}
          //  row={id}
          column={'customScore'}
          //  onDataChange={onDataChange}
          isCustom={true}
        />
      </StudentScore>
      <StudentScore>
        <ScoreCell
          value={isNaN(customScore) ? 8 : customScore}
          allowChange
          // allowChange={allowCustomChange && !viewOnly}
          grades={grades}
          //  usePercentage={usePercentage}
          //  row={id}
          column={'customScore'}
          //  onDataChange={onDataChange}
          isCustom={true}
        />
      </StudentScore>
    </Box>
  );
}

StudentRow.propTypes = {
  // children: PropTypes.node,
};
