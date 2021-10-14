import React from 'react';
import Button from './components/Button';
import Text from './components/Text';
import Image from './components/Image';

export default function index() {
  return (
    <div>
      <p>Private</p>
      <Button>Hola Mundo</Button>
      <Text>Hola Mundo</Text>
      <Text bold>Hola Mundo</Text>
      <Image />
    </div>
  );
}
