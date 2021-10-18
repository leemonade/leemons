import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import { useContextProvider as useGlobalProvider } from './contexts/global';

function AppWrapper({ children }) {
  const GlobalProvider = useGlobalProvider();
  return <GlobalProvider>{children}</GlobalProvider>;
}

ReactDom.render(
  <React.StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </React.StrictMode>,
  document.getElementById('root')
);
