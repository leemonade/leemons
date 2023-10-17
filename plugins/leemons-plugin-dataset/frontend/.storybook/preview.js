import React from 'react';
import { ThemeProvider } from '@bubbles-ui/components';
import '!style-loader!css-loader!./global.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <React.StrictMode>
        <ThemeProvider>
          <div data-floating-menu-container role="main">
            <Story />
          </div>
        </ThemeProvider>
      </React.StrictMode>
    ),
  ],
};

export default preview;
