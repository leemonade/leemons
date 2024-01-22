import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { ResponsiveBar } from '@nivo/bar';
import Bar from './Bar';
import useGradesGraphStyles from './GradesGraph.styles';

function extrapolateScoresToNearestScale({ scores, grades }) {
  return scores.map((score) => {
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

export default function GradesGraph({ grades, minimumGrade, scores, students, labels }) {
  const { classes, theme } = useGradesGraphStyles();

  const [barWidth, setBarWidth] = React.useState(0);

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

  return (
    <Box className={classes.root}>
      <ResponsiveBar
        data={data}
        keys={['percentage']}
        indexBy="value"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        enableGridY
        enableGridX={false}
        gridYValues={[25, 50, 75]}
        maxValue={100}
        padding={0.3}
        layout="vertical"
        barComponent={(props) => {
          if (barWidth !== props.bar.width) {
            setBarWidth(props.bar.width);
          }

          return <Bar minimumGrade={minimumGrade} {...props} />;
        }}
        markers={[
          {
            axis: 'x',
            value: minimumGrade,
            lineStyle: {
              stroke: '#E0914B',
              transform: `translateX(${barWidth / 2}px)`,
            },
            legendPosition: 'top',
            textStyle: {
              transform: `translate(${barWidth / 2}px, -10px)`,
              fill: '#878D96',
            },
            legend: labels?.passed,
          },
        ]}
        axisLeft={{
          legend: `${labels?.students} (${students?.length ?? 0})`,
          legendPosition: 'middle',
          tickValues: [25, 50, 75, 100],
          format: (value) => `${value}%`,
          tickSize: 0,
          tickPadding: 8,
          legendOffset: -50,
        }}
        axisBottom={{
          legend: labels?.califications,
          legendPosition: 'middle',
          legendOffset: 40,
          tickSize: 0,
          tickPadding: 8,
          format: (value) => data.find((d) => d.value === value)?.label,
        }}
        theme={{
          grid: {
            line: {
              strokeDasharray: '4',
              stroke: theme.colors.uiBackground03,
              strokeOpacity: 0.4,
            },
          },
        }}
        layers={['axes', 'markers', 'bars', 'grid']}
      />
    </Box>
  );
}
