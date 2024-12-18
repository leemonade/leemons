import { Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { getWeightedAvgScore } from '../../../helpers/getWeightedAvgScore';

import { StudentRow } from './StudentRow';

export function RightContentBody({ studentsData, grades, activities, useNumbers }) {
  const studentsRows = studentsData.map((student) => {
    const avgScore = getWeightedAvgScore({
      studentActivities: student.activities,
      activities,
      grades,
      useNumbers,
    });

    return <StudentRow key={student.id} {...student} grades={grades} avgScore={avgScore} />;
  });

  return (
    <Box sx={(theme) => ({ borderLeft: `4px solid ${theme.colors.ui03}` })}>{studentsRows}</Box>
  );
}

RightContentBody.propTypes = {
  studentsData: PropTypes.object.isRequired,
  grades: PropTypes.array.isRequired,
  activities: PropTypes.array.isRequired,
  useNumbers: PropTypes.bool.isRequired,
};
