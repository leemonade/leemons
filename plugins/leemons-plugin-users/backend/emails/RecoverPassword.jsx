import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Head, Html, Preview, Link, Text } from '@react-email/components';
import EmailLayout from './EmailLayout.jsx';

const messages = {
  en: {
    title: 'Password Recovery',
    actionText: 'Click the following link to recover your password:',
    buttonText: 'Recover password',
    infoText: 'This link will expire in 15 minutes and can only be used once.',
    alternativeActionText:
      'If the above button does not work, paste this link into your web browser:',
    noActionText: 'If you did not make this request, you can ignore this email.',
  },
  es: {
    title: 'Recuperación de contraseña',
    actionText: 'Haz clic en el siguiente enlace para recuperar tu contraseña:',
    buttonText: 'Recuperar contraseña',
    infoText: 'Este enlace caducará en 15 minutos y solo puede utilizarse una vez.',
    alternativeActionText:
      'Si el botón anterior no funciona, pega este enlace en tu navegador web:',
    noActionText: 'Si no has hecho esta solicitud, puedes ignorar este correo electrónico.',
  },
};

const RecoverPassword = ({ locale = 'en' } = {}) => {
  const previewText = `[Leemons] ${messages[locale].title}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <EmailLayout title={messages[locale].title}>
        <Container className="text-center mt-4">
          <Text className="text-sm font-bold leading-4">{messages[locale].actionText}</Text>
          <Button
            href="{{it.resetUrl}}"
            className="bg-[#B4E600] py-2 px-4 my-2 rounded text-black text-[12px] no-underline text-center"
          >
            {messages[locale].buttonText}
          </Button>
          <Text className="text-xs leading-4">{messages[locale].infoText}</Text>
        </Container>

        <Container className="bg-white text-center px-4 pb-4 rounded-lg mt-4">
          <Text className="text-xs">{messages[locale].alternativeActionText}</Text>
          <Link href="{{it.resetUrl}}" className="text-sm underline break-all">
            {'{{it.resetUrl}}'}
          </Link>
        </Container>
        <Container className="text-center mt-2">
          <Text className="text-xs">{messages[locale].noActionText}</Text>
        </Container>
      </EmailLayout>
    </Html>
  );
};

RecoverPassword.propTypes = {
  locale: PropTypes.string,
};

export default RecoverPassword;
