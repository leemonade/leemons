const colorValues = require('./colorNames');

const colorObject = {
  transparent: 'transparent',
  current: 'currentColor',
};

Object.entries(colorValues).forEach(([key, item]) => {
  colorObject[key] = ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) {
      return `hsla(var(${item}) / ${opacityValue})`;
    }
    if (opacityVariable !== undefined) {
      return `hsla(var(${item}) / var(${opacityVariable}, 1))`;
    }
    return `hsl(var(${item}))`;
  };
});

const globalColors = {
  ...colorObject,
  secondary: {
    DEFAULT: colorObject.secondary,
    10: '#F7F9FC',
    20: '#E8EDF4',
    50: '#B3BFD6',
    100: '#9DADCA',
    200: '#7289B3',
    300: '#5B6577',
    400: '#333F56',
    500: '#212B3D',
    600: '#1A202B',
    700: '#0F141C',
    800: '#06080B',
    900: '#000000',
  },
  primary: {
    DEFAULT: colorObject.primary,
    50: '#FFFFFF',
    100: '#F1F7FF',
    200: '#C9DFFF',
    300: '#A1C7FF',
    400: '#78AEFF',
    500: '#4F96FF',
    600: '#217BFF',
    700: '#0062F2',
    800: '#004FC4',
    900: '#003D96',
  },
  accent: {
    DEFAULT: colorObject.accent,
    50: '#FFFFFF',
    100: '#FFFFF2',
    200: '#FFFFD9',
    300: '#FEFFBF',
    400: '#FEFFA6',
    500: '#FEFF8C',
    600: '#FEFF68',
    700: '#FDFF45',
    800: '#FDFF21',
    900: '#FAFC00',
  },
  gray: {
    DEFAULT: '#272D37',
    10: '#F7F8FA',
    20: '#E8EDF4',
    30: '#D9DDE2',
    50: '#BBC1CE',
    100: '#A8B0C0',
    200: '#818DA4',
    300: '#5F6C83',
    400: '#434C5D',
    500: '#272D37',
    600: '#1F232B',
    700: '#16191F',
    800: '#0E1013',
    900: '#050607',
  },
};

module.exports = globalColors;
