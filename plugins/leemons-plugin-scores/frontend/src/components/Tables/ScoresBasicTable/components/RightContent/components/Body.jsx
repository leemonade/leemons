import { Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { getWeightedAvgScore } from '../../../helpers/getWeightedAvgScore';

import { StudentRow } from './StudentRow';

export function RightContentBody({
  studentsData,
  grades,
  activities,
  useNumbers,
  retakes,
  onDataChange,
  usePercentage,
  viewOnly,
  hideCustom,
  labels,
}) {
  const studentsRows = studentsData.map((student) => {
    const avgScore = getWeightedAvgScore({
      studentActivities: student.activities,
      activities,
      grades,
      useNumbers,
    });

    return (
      <StudentRow
        key={student.id}
        {...student}
        grades={grades}
        avgScore={avgScore}
        retakes={retakes}
        onDataChange={onDataChange}
        usePercentage={usePercentage}
        viewOnly={viewOnly}
        hideCustom={hideCustom}
        labels={labels}
      />
    );
  });

  return (
    <Box sx={(theme) => ({ borderLeft: `4px solid ${theme.colors.ui03}`, paddingRight: 2 })}>
      {studentsRows}
    </Box>
  );
}

RightContentBody.propTypes = {
  studentsData: PropTypes.object.isRequired,
  grades: PropTypes.array.isRequired,
  activities: PropTypes.array.isRequired,
  useNumbers: PropTypes.bool.isRequired,
  retakes: PropTypes.array,
  onDataChange: PropTypes.func,
  usePercentage: PropTypes.bool,
  viewOnly: PropTypes.bool,
  hideCustom: PropTypes.bool,
  labels: PropTypes.object,
};
