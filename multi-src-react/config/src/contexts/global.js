import React, { createContext, useState } from 'react';

const context = createContext();

export default context;
export const { Provider: GlobalProvider, Consumer: GlobalConsumer } = context;

export const useContextProvider = () => {
  const [value, setValue] = useState({
    leemons: {
      version: '1.0.0',
    },
  });
  const Provider = ({ children }) => (
    <GlobalProvider value={{ ...value, setValue }}>{children}</GlobalProvider>
  );

  Provider.displayName = 'GlobalProvider';

  return Provider;
};
