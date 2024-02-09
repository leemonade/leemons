import React from 'react';
import PropTypes from 'prop-types';
import { Container, Head, Html, Preview, Text } from '@react-email/components';
import EmailLayout from './EmailLayout.jsx';

const messages = {
  en: {
    title: 'Hi, {{it.userName}}',
    actionText: 'You have been added to the "{{it.profileName}}" profile.',
    noActionText: 'This information does not require any further action.',
  },
  es: {
    title: 'Hola, {{it.userName}}',
    actionText: 'Te han añadido al perfil de "{{it.profileName}}".',
    noActionText: 'Esta información no requiere de ninguna acción adicional.',
  },
};

const NewProfileAdded = ({ locale = 'en' } = {}) => {
  const previewText = `[Leemons] ${messages[locale].title}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <EmailLayout title={messages[locale].title}>
        <Container className="text-center mt-4">
          <Text className="text-sm font-bold leading-4">{messages[locale].actionText}</Text>
        </Container>

        <Container className="text-center mt-2">
          <Text className="text-xs">{messages[locale].noActionText}</Text>
        </Container>
      </EmailLayout>
    </Html>
  );
};

NewProfileAdded.propTypes = {
  locale: PropTypes.string,
};

export default NewProfileAdded;
