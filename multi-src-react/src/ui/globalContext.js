import React, { createContext, useState, useEffect } from 'react';

const context = createContext();

export default context;
export const { Provider: GlobalProvider, Consumer: GlobalConsumer } = context;

export const useContextProvider = () => {
  const [value, setValue] = useState({
    ui: {
      version: '1.0.0',
    },
  });

  useEffect(() => {
    console.log('Hello from @ui global context');
  }, []);

  const Provider = ({ children }) => (
    <GlobalProvider value={{ ...value, setValue }}>{children}</GlobalProvider>
  );

  Provider.displayName = 'UIGlobalProvider';

  return Provider;
};
