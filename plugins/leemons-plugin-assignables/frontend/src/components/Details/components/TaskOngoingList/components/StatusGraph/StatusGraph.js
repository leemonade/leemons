import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { OpenIcon, TimeClockCircleIcon, CheckCircleIcon } from '@bubbles-ui/icons/outline';
import { ResponsiveRadialBar } from '@nivo/radial-bar';
import { useStatusGraphStyles } from './StatusGraph.styles';

const FONT_FAMILY = 'Albert Sans';

const THEME = {
  labels: {
    text: {
      fontSize: 14,
      fill: '#1A1A1E',
      fontFamily: FONT_FAMILY,
    },
  },
  legends: {
    text: {
      fontSize: 13,
      fill: '#70707B',
      fontFamily: FONT_FAMILY,
    },
  },
};

function CenteredMetric({ studentCount, center }) {
  const [centerX, centerY] = center;
  return (
    <text
      x={centerX}
      y={centerY - 10}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fontSize: 18,
        fill: '#70707B',
        fontFamily: FONT_FAMILY,
      }}
    >
      Total: {studentCount}
    </text>
  );
}

CenteredMetric.propTypes = {
  studentCount: PropTypes.number,
  center: PropTypes.arrayOf(PropTypes.number),
};

export default function StatusGraph({ studentCount, status }) {
  const { classes } = useStatusGraphStyles();

  const data = useMemo(
    () =>
      status.map((s) => ({
        ...s,
        studentPercentage: (s.studentCount / studentCount) * 100,
      })),
    [status, studentCount]
  );

  const radialData = useMemo(() => {
    const temp = data.map((item) => ({ x: item.label, y: item.studentCount }));
    const newData = temp.map((estado, index) => {
      if (index === 0 || index === temp.length - 1) {
        return { x: estado.x, y: estado.y };
      }

      return { x: estado.x, y: estado.y - temp[index - 1].y };
    });

    return [{ id: 'status', data: newData.reverse() }];
  }, [data]);

  return (
    <Box className={classes.root}>
      <ResponsiveRadialBar
        data={radialData}
        startAngle={-90}
        endAngle={90}
        height={600}
        theme={THEME}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        innerRadius={0.45}
        enableTracks={false}
        enableRadialGrid={false}
        enableCircularGrid={false}
        radialAxisStart={null}
        circularAxisOuter={null}
        enableLabels={true}
        animate={false}
        colors={['#FFEA67', '#B5AFD4', '#69A5CD', '#A4D15E', '#FFAD5B']}
        layers={[
          'bars',
          'labels',
          'legends',
          (layer) => <CenteredMetric {...layer} studentCount={studentCount} />,
        ]}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: -240,
            itemsSpacing: 6,
            itemDirection: 'left-to-right',
            itemWidth: 95,
            itemHeight: 18,
            itemTextColor: '#1A1A1E',
            symbolSize: 18,
            symbolShape: 'square',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                },
              },
            ],
          },
        ]}
      />
    </Box>
  );
}

StatusGraph.propTypes = {
  studentCount: PropTypes.number,
  status: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      icon: PropTypes.node,
      studentCount: PropTypes.number,
    })
  ),
};

StatusGraph.defaultProps = {
  studentCount: 300,
  status: [
    {
      id: 'opened',
      label: 'Abierta',
      icon: <OpenIcon />,

      studentCount: 300,
    },
    {
      id: 'started',
      label: 'Empezada',
      icon: <TimeClockCircleIcon />,
      studentCount: 55,
    },
    {
      id: 'submitted',
      label: 'Entregada',
      icon: <CheckCircleIcon />,
      studentCount: 0,
    },
  ].reverse(),
};
