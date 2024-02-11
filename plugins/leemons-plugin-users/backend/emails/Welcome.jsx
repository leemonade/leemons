import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Head, Html, Preview, Link, Text } from '@react-email/components';
import EmailLayout from './EmailLayout.jsx';

const messages = {
  en: {
    title: 'Welcome to {{it.__platformName}}',
    actionText: 'Click on the following link to create your password and access your account:',
    buttonText: 'Set up account',
    infoText: 'This link will expire in {{it.expDays}} days and can only be used once.',
    alternativeActionText:
      'If the button above doesn’t work, paste this link into your web browser:',
    noActionText: 'If you did not make this request, you can safely ignore this email.',
  },
  es: {
    title: 'Te damos la bienvenida a {{it.__platformName}}',
    actionText: 'Haz click en el siguiente enlace para crear tu contraseña y acceder a tu cuenta:',
    buttonText: 'Configurar cuenta',
    infoText: 'Este enlace caducará en {{it.expDays}} días y sólo puede utilizarse una vez.',
    alternativeActionText:
      'Si el botón anterior no funciona, pega este enlace en tu navegador web:',
    noActionText: 'Si no has hecho esta solicitud, puedes ignorar este correo electrónico.',
  },
};

const Welcome = ({ locale = 'en' } = {}) => {
  const previewText = `[Leemons] ${messages[locale].title}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <EmailLayout title={messages[locale].title}>
        <Container className="text-center mt-4">
          <Text className="text-sm font-bold leading-4">{messages[locale].actionText}</Text>
          <Button
            href="{{it.url}}"
            className="bg-[#B4E600] py-2 px-4 my-2 rounded text-black text-[12px] no-underline text-center"
          >
            {messages[locale].buttonText}
          </Button>
          <Text className="text-xs leading-4">{messages[locale].infoText}</Text>
        </Container>

        <Container className="bg-white text-center px-4 pb-4 rounded-lg mt-4">
          <Text className="text-xs">{messages[locale].alternativeActionText}</Text>
          <Link href="{{it.url}}" className="text-sm underline break-all">
            {'{{it.url}}'}
          </Link>
        </Container>
        <Container className="text-center mt-2">
          <Text className="text-xs">{messages[locale].noActionText}</Text>
        </Container>
      </EmailLayout>
    </Html>
  );
};

Welcome.propTypes = {
  locale: PropTypes.string,
};

export default Welcome;
