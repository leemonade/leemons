import { useState, useEffect, StrictMode } from 'react';
import { render as renderDom } from 'react-dom';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App';
import { Provider as GlobalProvider } from './contexts/global';

declare global {
  interface Window {
    toggleQueryDevtools: (persist: boolean) => void;
  }
}

const queryClient = new QueryClient();

function ReactQueryDevtoolsWrapper() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ReactQueryDevtoolsWrapper should not be used in production');
  }

  const [showQueryDevtools, setShowQueryDevtools] = useState(
    window.localStorage.getItem('showReactQueryDevTools') === 'true'
  );

  useEffect(() => {
      window.toggleQueryDevtools = (persist) => {
        setShowQueryDevtools((prevState) => {
          const newState = !prevState;
        if (persist) {
          window.localStorage.setItem('showReactQueryDevTools', newState.toString());
        }
        return newState;
      });
    };
  }, [setShowQueryDevtools]);

  if (showQueryDevtools) {
    return <ReactQueryDevtools initialIsOpen={false} />;
  }

  return null;
}

const render = (Component) => {
  renderDom(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <Component />
        </GlobalProvider>
        {process.env.NODE_ENV !== 'production' && <ReactQueryDevtoolsWrapper />}
      </QueryClientProvider>
    </StrictMode>,
    document.getElementById('root')
  );
};

render(App);
