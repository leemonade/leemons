import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { OpenIcon, TimeClockCircleIcon, CheckCircleIcon } from '@bubbles-ui/icons/outline';
import { ResponsiveBar } from '@nivo/bar';
import { Box, useResizeObserver } from '@bubbles-ui/components';
import { useStatusGraphStyles } from './StatusGraph.styles';
import Bar from './Bar';

function Tick({ box: { x, y, textX, textY }, status }) {
  const maxTextWidth = 80;

  return (
    <g transform={`translate(0, ${y})`}>
      <g
        transform={`translate(${0 - maxTextWidth - 30}, ${textY - 12})`}
        style={{ position: 'relative', color: '#4D5358' }}
      >
        {status.icon}
      </g>
      <text transform={`translate(${0 - maxTextWidth - 10}, ${textY})`} textAnchor="start">
        {status?.label}
      </text>
    </g>
  );
}

export default function StatusGraph({ studentCount, status }) {
  const { classes, theme } = useStatusGraphStyles();

  const data = useMemo(
    () =>
      status.map((s) => ({
        ...s,
        studentPercentage: (s.studentCount / studentCount) * 100,
      })),
    [status, studentCount]
  );

  return (
    <Box className={classes.root}>
      <ResponsiveBar
        data={data}
        keys={['studentPercentage']}
        indexBy="id"
        margin={{ top: 50, right: 130, bottom: 50, left: 120 }}
        padding={0.3}
        groupMode="grouped"
        layout="horizontal"
        enableGridX
        enableGridY={false}
        gridXValues={[0, 25, 50, 75, 100]}
        maxValue={100}
        barComponent={Bar}
        axisLeft={{
          renderTick: (props) => (
            <Tick box={props} status={data.find((d) => d.id === props.value)} />
          ),
        }}
        axisBottom={{
          tickValues: [0, 25, 50, 75, 100],
          format: (value) => `${value}%`,
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
        layers={['axes', 'bars', 'grid', 'markers']}
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
