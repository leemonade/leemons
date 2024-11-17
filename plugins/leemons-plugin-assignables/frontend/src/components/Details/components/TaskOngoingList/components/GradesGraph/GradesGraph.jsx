import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { DistributionChart } from '@assignables/components/DistributionChart';
import { useGradesGraphStyles } from './GradesGraph.styles';

function extrapolateScoresToNearestScale({ scores, grades }) {
  return scores?.map((score) => {
    let nearestGrade = grades[0];
    let difference = Math.abs(score.score - nearestGrade.number);

    grades.forEach((grade) => {
      const currentDifference = Math.abs(score.score - grade.number);
      if (currentDifference < difference) {
        nearestGrade = grade;
        difference = currentDifference;
      }
    });

    return { ...score, score: nearestGrade.number };
  });
}

export default function GradesGraph({
  grades,
  minimumGrade,
  minimumScale,
  scores,
  students,
  labels,
}) {
  const { classes } = useGradesGraphStyles();

  const normalizedScores = useMemo(
    () => extrapolateScoresToNearestScale({ scores, grades }),
    [grades, scores]
  );

  const data = useMemo(
    () =>
      grades?.map((grade) => ({
        value: grade.number,
        label: grade?.letter ?? grade?.number,
        studentCount: normalizedScores.filter((score) => score.score === grade.number).length,
        percentage:
          (normalizedScores.filter((score) => score.score === grade.number).length /
            students.length) *
          100,
      })) ?? [],
    [grades, normalizedScores]
  );

  const distributionChartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        value: d.studentCount,
      })),
    [data]
  );

  return (
    <Box className={classes.root}>
      <DistributionChart
        height={300}
        data={distributionChartData}
        maxValue={students?.length}
        minimumScale={minimumScale}
        passValue={minimumGrade}
        legendLeft={`${labels?.students} (${students?.length ?? 0})`}
        legendBottom={labels?.califications}
        passLabel={labels?.passed}
      />
    </Box>
  );
}

GradesGraph.propTypes = {
  grades: PropTypes.arrayOf(PropTypes.object),
  minimumGrade: PropTypes.number,
  minimumScale: PropTypes.number,
  scores: PropTypes.arrayOf(PropTypes.object),
  students: PropTypes.arrayOf(PropTypes.object),
  labels: PropTypes.object,
};
