import React, { useContext, useEffect } from 'react';
import GlobalContext from '@leemons/contexts/global';
import UIGlobalContext from '@ui/globalContext';
import Button from './components/Button';
import Text from './components/Text';
import Image from './components/Image';

export default function index() {
  const context = useContext(GlobalContext);
  const uiContext = useContext(UIGlobalContext);

  useEffect(() => {
    context.leemons
      .api('https://pokeapi.co/api/v2/pokemon/:pokemon', {
        params: { pokemon: 'ditto' },
      })
      .then(console.log);
  }, []);

  return (
    <>
      {context?.leemons.version}
      <p>Hola</p>
      <Button>Hola Mundo</Button>
      <button
        onClick={() => {
          context?.setValue((value) => ({
            ...value,
            leemons: { version: '2.0.0' },
          }));
        }}
      >
        Update version
      </button>
      <Image />
      <Text>Hola Mundo</Text>
      <Text bold>Hola Mundo</Text>
    </>
  );
}
