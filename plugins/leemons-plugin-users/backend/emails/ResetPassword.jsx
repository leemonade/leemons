import EmailLayout from '@leemons/emails/emails/EmailLayout.jsx';
import { Button, Container, Text } from '@react-email/components';
import PropTypes from 'prop-types';
// biome-ignore lint/correctness/noUnusedImports: File is used on backend rendering
import React from 'react';

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
  const previewText = `${messages[locale].title}`;

  return (
    <EmailLayout previewText={previewText} title={messages[locale].title} locale={locale}>
      <Container className="text-center">
        <span className="text-[16px] font-medium leading-6 block mt-4">
          {messages[locale].actionText}
        </span>
        <Button
          href="{{it.loginUrl}}"
          className="bg-[#B4E600] py-3 px-4 mt-10 mb-6 rounded text-black text-[14px] no-underline text-center"
        >
          {messages[locale].buttonText}
        </Button>
      </Container>

      <Container className="text-center mt-2">
        <Text className="text-[14px] leading-5">{messages[locale].noActionText}</Text>
      </Container>
    </EmailLayout>
  );
};

ResetPasword.propTypes = {
  locale: PropTypes.string,
};

export default ResetPasword;
