/* eslint-disable no-param-reassign */
export default function getStyle({ ws }) {
  return (cell, { relRow: row, row: absoluteRow, col: absoluteCol }) => {
    const border = {};
    const isFirstRow = row === 2 || row === 3;

    if (isFirstRow) {
      border.top = {
        style: 'medium',
        color: {
          argb: '000000',
        },
      };
      const upperCell = ws.getCell(absoluteRow - 1, absoluteCol);
      upperCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'F1F9FE' },
      };
    }

    cell.border = border;
  };
}
