/* eslint-disable no-param-reassign */

const colors = {
  black: 'FF000000',
  white: 'FFFFFFFF',
  red: 'FF400040',
  yellow: 'FFFCD966',
  purple: 'FF800080',
  blue: 'FF00008B',
  green: 'FF008000',
  lightBlue: 'FFDEEAF6',
  lightRed: 'FFFFEFEF',
  lightYellow: 'FFFEF2CC',
  lightPurple: 'FFE6E6FF',
  lightGreen: 'FFE6FFE6',
};

function styleCell({ cell, fontColor, bgColor, alignment }) {
  cell.font = {
    bold: true,
    color: { argb: colors[fontColor] ?? colors.black },
  };
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: colors[bgColor] ?? colors.white },
  };
  if (alignment) {
    cell.alignment = alignment;
  }
}

module.exports = { styleCell };
