const tailwindPlugin = require('tailwindcss/plugin');
const colors = require('./colors/index');
const fontFamily = require('./fonts/index');
const utilities = require('./utilities');
const base = require('./base');
const unstyled = require('./unstyled');
const unstyledRtl = require('./unstyled.rtl');
const styled = require('./styled');
const styledRtl = require('./styled.rtl');
const utilitiesUnstyled = require('./utilities-unstyled');
const utilitiesStyled = require('./utilities-styled');
const themes = require('./colors/themes');
const colorNames = require('./colors/colorNames');
const hex2hsl = require('./colors/hex2hsl');
const width = require('./extends/width');
const boxShadow = require('./extends/boxShadow');

// check if tailwindcss package exists
const isTailwindInstalled = typeof tailwindPlugin !== 'undefined';

// eslint-disable-next-line no-unused-vars
const mainFunction = ({ addBase, addComponents, addUtilities, config }) => {
  const includedItems = [];
  let logs = false;
  if (config('leemons.logs') !== false) {
    logs = true;
  }
  if (logs) {
    console.log();
    console.log('\x1b[35m%s\x1b[0m', `🍋 LeemonsUI components`, '\x1b[0m');
    console.group();

    if (isTailwindInstalled) {
      console.log('\x1b[36m%s\x1b[0m', `✔︎ Tailwind is present`, '\x1b[0m');
    }
  }

  // inject @base style
  if (config('leemons.base') !== false) {
    addBase(base);
    includedItems.push('base');
  }

  // inject components
  // because rollupjs doesn't supprt dynamic require
  let file = styled;
  if (config('leemons.styled') === false && config('leemons.rtl') !== true) {
    includedItems.push('unstyled components');
    file = unstyled;
  } else if (config('leemons.styled') === false && config('leemons.rtl') === true) {
    includedItems.push('unstyled components');
    console.log('\x1b[36m%s\x1b[0m', ' Direction:', '\x1b[0m', 'RTL');
    file = unstyledRtl;
  } else if (config('leemons.styled') !== false && config('leemons.rtl') !== true) {
    includedItems.push('components');
    file = styled;
  } else if (config('leemons.styled') !== false && config('leemons.rtl') === true) {
    includedItems.push('components');
    console.log('\x1b[36m%s\x1b[0m', ' Direction:', '\x1b[0m', 'RTL');
    file = styledRtl;
  }
  addComponents(file);

  const includedThemesObj = {};

  function convertThemeColorsToHsl(input) {
    const resultObj = {};
    if (typeof input === 'object' && input !== null) {
      Object.entries(input).forEach(([rule, value]) => {
        if (colorNames[rule]) {
          resultObj[colorNames[rule]] = hex2hsl(value);
        } else {
          resultObj[rule] = value;
          // console.log(input)
        }
      });
      return resultObj;
    }
    return input;
  }

  // add default themes
  Object.entries(themes).forEach(([theme]) => {
    includedThemesObj[theme] = convertThemeColorsToHsl(themes[theme]);
  });

  // add custom themes
  if (Array.isArray(config('leemons.themes'))) {
    config('leemons.themes').forEach((item) => {
      if (typeof item === 'object' && item !== null) {
        Object.entries(item).forEach(([customThemeName, customThemevalue]) => {
          includedThemesObj[`[data-theme=${customThemeName}]`] = convertThemeColorsToHsl(
            customThemevalue
          );
        });
      }
    });
  }

  let themeOrder = [];
  if (Array.isArray(config('leemons.themes'))) {
    config('leemons.themes').forEach((theme) => {
      if (typeof theme === 'object' && theme !== null) {
        // eslint-disable-next-line no-unused-vars
        Object.entries(theme).forEach(([customThemeName, customThemevalue]) => {
          themeOrder.push(customThemeName);
        });
        // eslint-disable-next-line no-prototype-builtins
      } else if (includedThemesObj.hasOwnProperty(`[data-theme=${theme}]`)) {
        themeOrder.push(theme);
      }
    });
  } else if (config('leemons.themes') !== false) {
    themeOrder = ['light', 'dark'];
  } else if (config('leemons.themes') === false) {
    themeOrder.push('light');
  }

  // inject themes in order
  themeOrder.forEach((themeName, index) => {
    if (index === 0) {
      // first theme as root
      addBase({ ':root': includedThemesObj[`[data-theme=${themeName}]`] });
    } else if (index === 1) {
      // auto dark
      if (themeOrder[0] !== 'dark' && themeOrder.includes('dark')) {
        addBase({
          '@media (prefers-color-scheme: dark)': {
            ':root': includedThemesObj['[data-theme=dark]'],
          },
        });
      }
      // theme 0 with name
      addBase({
        [`[data-theme=${themeOrder[0]}]`]: includedThemesObj[`[data-theme=${themeOrder[0]}]`],
      });
      // theme 1 with name
      addBase({
        [`[data-theme=${themeOrder[1]}]`]: includedThemesObj[`[data-theme=${themeOrder[1]}]`],
      });
    } else {
      addBase({
        [`[data-theme=${themeName}]`]: includedThemesObj[`[data-theme=${themeName}]`],
      });
    }
  });
  includedItems.push(`themes[${themeOrder.length}]`);

  // inject @utilities style needed by components
  if (config('leemons.utils') !== false) {
    addComponents(utilities, { variants: ['responsive'] });
    addComponents(utilitiesUnstyled, { variants: ['responsive'] });
    addComponents(utilitiesStyled, { variants: ['responsive'] });
    includedItems.push('utilities');
  }

  if (logs) {
    console.log('\x1b[32m%s\x1b[0m', '✔︎ Including:', '\x1b[0m', `${includedItems.join(', ')}`);

    if (!isTailwindInstalled) {
      console.log(`\n\x1b[33;1m! warning\x1b[0m - unable to require \x1b[36mtailwindcss/plugin\x1b[0m
LeemonsUI color are now only available for LeemonsUI components.
If you want to use LeemonsUI color as utility classes (like 'bg-primary')
you need to add this to your \x1b[34mtailwind.config.js\x1b[0m file:
───────────────────────────────────────
\x1b[34mmodule.exports = {
  \x1b[32mtheme: {
    extend: {
      colors: require('leemons-ui/dist/theme/colors'),
    },
  },\x1b[0m
\x1b[34m}\x1b[0m
───────────────────────────────────────
      `);
    }
    console.log();
    console.groupEnd();
  }
};

if (isTailwindInstalled) {
  module.exports = tailwindPlugin(mainFunction, {
    theme: { fontFamily, boxShadow, extend: { colors, width } },
  });
} else {
  module.exports = mainFunction;
}
