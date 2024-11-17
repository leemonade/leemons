import React from 'react';
import { useTheme } from '@bubbles-ui/components';

export default function Bar({ bar: { x, y, width, height, data }, minimumGrade }) {
  const theme = useTheme();
  const maxY = y + height;

  const labelHeight = 20;

  const color =
    (data.data.value ?? 0) < minimumGrade
      ? theme.other.core.color.danger['100']
      : theme.other.core.color.success['100'];
  const secondaryColor =
    (data.data.value ?? 0) < minimumGrade
      ? theme.other.core.color.danger['500']
      : theme.other.global.background.color.primary.default;

  return (
    <>
      <rect
        x={0}
        y={0}
        height={maxY}
        width={2}
        fill={theme.other.global.border.color.line.default}
      />

      <g transform={`translate(${x}, ${y > maxY - labelHeight ? maxY - labelHeight : y})`}>
        {height > 0 && (
          <g>
            <rect y={labelHeight} width={width} height={height - labelHeight} fill={color} />
            <rect y={0} height={labelHeight} width={width} fill={secondaryColor} />
            <text
              x={width / 2}
              y={labelHeight / 2}
              textAnchor="middle"
              dominantBaseline={'central'}
              fill="white"
              fontWeight={600}
            >
              {data.data.studentCount ?? 0}
            </text>
          </g>
        )}
      </g>
    </>
  );
}
