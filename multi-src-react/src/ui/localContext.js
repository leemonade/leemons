import React, { createContext, useState, useEffect } from 'react';

const context = createContext();

export default context;
export const { Provider: GlobalProvider, Consumer: GlobalConsumer } = context;

export const useContextProvider = () => {
  const [value, setValue] = useState({
    local: true,
  });

  useEffect(() => {
    console.log('Hello from @ui local context');
  }, []);

  const Provider = ({ children }) => (
    <GlobalProvider value={{ ...value, setValue }}>{children}</GlobalProvider>
  );

  Provider.displayName = 'UILocalProvider';

  return Provider;
};
