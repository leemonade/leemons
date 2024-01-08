import React from 'react';
import { useTheme } from '@bubbles-ui/components';

export default function Bar({ bar: { x: _x, y, width: _width, height, data } }) {
  const x = _x + 1;
  const width = _width - 1;
  const theme = useTheme();

  const color = theme.other.core.color.success['100'];

  return (
    <g transform={`translate(${x}, ${y})`}>
      {width > 0 && (
        <g>
          <rect width={width > 34 ? width - 34 : 0} height={height} fill={color} />
          <rect
            x={width > 34 ? width - 34 : 0}
            width={34}
            height={height}
            fill={theme.other.global.background.color.primary.default}
          />
          <text
            x={width > 34 ? width - 17 : 17}
            y={height / 2}
            textAnchor="middle"
            dominantBaseline={'central'}
          >
            {data.data.studentCount}
          </text>

          <text x={width < 34 ? 44 : width + 10} y={height / 2} dominantBaseline={'central'}>
            {`${data.value < 1 ? data.value.toFixed(2) : data.value.toFixed(0)}%`}
          </text>
        </g>
      )}
    </g>
  );
}
