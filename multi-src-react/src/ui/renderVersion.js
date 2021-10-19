import React, { useContext } from 'react';
import GlobalContext from '@leemons/contexts/global';

export default function renderVersion() {
  const context = useContext(GlobalContext);
  return <p> {context?.leemons.version}</p>;
}
