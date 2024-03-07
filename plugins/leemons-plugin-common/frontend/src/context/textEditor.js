import React from 'react';

export const TextEditorContext = React.createContext({});
export const TextEditorProvider = TextEditorContext.Provider;
export const useTextEditor = () => React.useContext(TextEditorContext);
