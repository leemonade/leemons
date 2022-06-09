import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import App from './App';
import { Provider as GlobalProvider } from './contexts/global';

const queryClient = new QueryClient();

function ReactQueryDevtoolsWrapper() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const [showQueryDevtools, setShowQueryDevtools] = useState(
    Boolean(window.localStorage.getItem('showReactQueryDevTools'))
  );

  useEffect(() => {
    window.toogleQueryDevtools = (persist) =>
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

ReactDom.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <App />
      </GlobalProvider>
      <ReactQueryDevtoolsWrapper />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
