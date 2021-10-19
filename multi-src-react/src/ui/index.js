import React, { useContext, useEffect, useState } from 'react';
import GlobalContext from '@leemons/contexts/global';
import Button from './components/Button';
import Text from './components/Text';
import Image from './components/Image';

export default function index() {
  const context = useContext(GlobalContext);
  const [changes, setChanges] = useState(0);

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
          console.log('Update');
          setChanges((changes) => changes + 1);
          context?.setValue((value) => ({
            ...value,
            leemons: {
              ...value.leemons,
              version: value.leemons.version
                .split('.')
                .map((_value, i) =>
                  i === 0 ? parseInt(_value, 10) + 1 : _value
                )
                .join('.'),
            },
          }));
        }}
      >
        Update version to {changes + 2}.0.0
      </button>
      <Image />
      <Text>Hola Mundo</Text>
      <Text bold>Hola Mundo</Text>
    </>
  );
}
