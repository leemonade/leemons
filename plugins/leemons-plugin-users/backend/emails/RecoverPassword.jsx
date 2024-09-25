import React from 'react';

import EmailLayout from '@leemons/emails/src/emails/EmailLayout.jsx';
import { Button, Container, Link, Text } from '@react-email/components';
import PropTypes from 'prop-types';

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
  const previewText = `${messages[locale].title}`;

  return (
    <EmailLayout previewText={previewText} title={messages[locale].title} locale={locale}>
      <Container className="text-center">
        <span className="text-[16px] font-medium leading-6 block mt-4">
          {messages[locale].actionText}
        </span>
        <Button
          href="{{it.resetUrl}}"
          className="bg-[#B4E600] py-3 px-4 mt-8 mb-6 rounded text-black text-[14px] no-underline text-center"
        >
          {messages[locale].buttonText}
        </Button>
        <Text className="text-[14px] leading-4">{messages[locale].infoText}</Text>
      </Container>

      <Container className="bg-white text-center px-4 pb-4 rounded-lg mt-4">
        <Text className="text-[14px]">{messages[locale].alternativeActionText}</Text>
        <Link href="{{it.resetUrl}}" className="text-sm underline break-all">
          {'{{it.resetUrl}}'}
        </Link>
      </Container>
      <Container className="text-center mt-2">
        <Text className="text-[14px] leading-5">{messages[locale].noActionText}</Text>
      </Container>
    </EmailLayout>
  );
};

RecoverPassword.propTypes = {
  locale: PropTypes.string,
};

export default RecoverPassword;
