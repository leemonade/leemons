import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Head, Html, Preview, Text } from '@react-email/components';
import EmailLayout from './EmailLayout.jsx';

const messages = {
  en: {
    title: 'Hello, {{it.name}}',
    actionText: 'Your password has been reset.',
    buttonText: 'Go to login',
    noActionText:
      'Please, do not reply to this email with your password. We will never ask for your password, and we advise against sharing it with anyone.',
  },
  es: {
    title: 'Hola, {{it.name}}',
    actionText: 'Tu contraseña ha sido restablecida.',
    buttonText: 'Ir a iniciar sesion',
    noActionText:
      'Por favor, no responda a este correo electrónico con su contraseña. Nunca le pediremos su contraseña, y le desaconsejamos que la comparta con nadie.',
  },
};

const ResetPasword = ({ locale = 'en' } = {}) => {
  const previewText = `[Leemons] ${messages[locale].title}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <EmailLayout title={messages[locale].title}>
        <Container className="text-center mt-4">
          <Text className="text-sm font-bold leading-4">{messages[locale].actionText}</Text>
          <Button
            href="{{it.loginUrl}}"
            className="bg-[#B4E600] py-2 px-4 my-2 rounded text-black text-[12px] no-underline text-center"
          >
            {messages[locale].buttonText}
          </Button>
        </Container>

        <Container className="text-center mt-2">
          <Text className="text-xs">{messages[locale].noActionText}</Text>
        </Container>
      </EmailLayout>
    </Html>
  );
};

ResetPasword.propTypes = {
  locale: PropTypes.string,
};

export default ResetPasword;
