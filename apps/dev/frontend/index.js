import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import { Provider as GlobalProvider } from './contexts/global';

const queryClient = new QueryClient();

function ReactQueryDevtoolsWrapper() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const [showQueryDevtools, setShowQueryDevtools] = useState(
    window.localStorage.getItem('showReactQueryDevTools') === 'true'
  );

  useEffect(() => {
    window.toggleQueryDevtools = (persist) =>
      setShowQueryDevtools((s) => {
        if (persist) {
          window.localStorage.setItem('showReactQueryDevTools', !s);
        }
        return !s;
      });
  }, [setShowQueryDevtools]);

  if (showQueryDevtools) {
    return <ReactQueryDevtools initialIsOpen={false} />;
  }

  return null;
}

const render = (Component) => {
  ReactDom.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <GlobalProvider>
          <Component />
        </GlobalProvider>
        <ReactQueryDevtoolsWrapper />
      </QueryClientProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
};

render(App);
