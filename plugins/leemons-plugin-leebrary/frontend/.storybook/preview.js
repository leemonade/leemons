import React from 'react';
import { ThemeProvider } from '@bubbles-ui/components';
import '!style-loader!css-loader!./global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <div data-floating-menu-container role="main">
              <Story />
            </div>
          </ThemeProvider>
        </QueryClientProvider>
      </React.StrictMode>
    ),
  ],
};

export default preview;
