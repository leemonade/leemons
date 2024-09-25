import React from 'react';

import EmailLayout from '@leemons/emails/src/emails/EmailLayout.jsx';
import { Container, Text } from '@react-email/components';
import PropTypes from 'prop-types';

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
  const previewText = `${messages[locale].title}`;

  return (
    <EmailLayout previewText={previewText} title={messages[locale].title} locale={locale}>
      <Container className="text-center">
        <span className="text-[16px] font-medium leading-6 block mt-4">
          {messages[locale].actionText}
        </span>
      </Container>

      <Container className="text-center mt-2">
        <Text className="text-[14px] leading-5">{messages[locale].noActionText}</Text>
      </Container>
    </EmailLayout>
  );
};

NewProfileAdded.propTypes = {
  locale: PropTypes.string,
};

export default NewProfileAdded;
