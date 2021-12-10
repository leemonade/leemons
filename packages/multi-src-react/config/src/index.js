import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import { Provider as GlobalProvider } from './contexts/global';

ReactDom.render(
  <React.StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
