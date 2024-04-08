import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Link, Text } from '@react-email/components';
import EmailLayout from '@leemons/emails/src/emails/EmailLayout.jsx';

const IS_DEV_MODE = String(process?.env?.EMAIL_DEV) === 'true';
const PLATFORM_NAME = '{{it.__platformName}}';

const messages = {
  en: {
    title: `Welcome to ${IS_DEV_MODE ? 'Leemons' : PLATFORM_NAME}!`,
    actionText: 'Click on the following link to activate your account and start using Leemons:',
    buttonText: 'Confirm Account',
    infoText: 'This link will expire in {{it.expDays}} days and can only be used once.',
    alternativeActionText:
      'If the button above doesn’t work, paste this link into your web browser:',
    noActionText: 'If you did not make this request, you can safely ignore this email.',
    supportText: 'Have you had any problems?',
    supportContactText: 'Contact our amazing team.',
    supportButtonText: 'Support Center',
  },
  es: {
    title: `Te damos la bienvenida a ${IS_DEV_MODE ? 'Leemons' : PLATFORM_NAME}!`,
    actionText:
      'Haz click en el siguiente enlace para activar tu cuenta y comenzar a usar Leemons:',
    buttonText: 'Confirmar cuenta',
    infoText: 'Este enlace caducará en {{it.expDays}} días y sólo puede utilizarse una vez.',
    alternativeActionText:
      'Si el botón anterior no funciona, pega este enlace en tu navegador web:',
    noActionText: 'Si no has hecho esta solicitud, puedes ignorar este correo electrónico.',
    supportText: '¿Has tenido algún problema?',
    supportContactText: 'Contacta con nuestro increíble equipo.',
    supportButtonText: 'Centro de soporte',
  },
};

const Welcome = ({ locale = 'en', url = '{{it.url}}' } = {}) => {
  const previewText = `[Leemons] ${messages[locale].title}`;

  return (
    <EmailLayout previewText={previewText} title={messages[locale].title} locale={locale}>
      <Container className="text-center">
        <span className="text-[16px] font-medium leading-6 block mt-4">
          {messages[locale].actionText}
        </span>
        <Button
          href={url}
          className="bg-[#B4E600] py-3 px-4 mt-8 mb-6 rounded text-black text-[14px] no-underline text-center"
        >
          {messages[locale].buttonText}
        </Button>
        <Text className="text-[14px] leading-5">{messages[locale].infoText}</Text>
      </Container>

      <Container className="bg-white text-center px-4 pb-4 rounded-lg">
        <Text className="text-[14px] leading-5">{messages[locale].alternativeActionText}</Text>
        <Link href={url} className="text-[14px] leading-5 underline break-all">
          {url}
        </Link>
      </Container>
      <Container className="text-center mt-2">
        <Text className="text-[14px] leading-5">{messages[locale].noActionText}</Text>
      </Container>
      <Container className="text-center mt-4">
        <Text className="text-[20px] font-bold">{messages[locale].supportText}</Text>
        <Text className="text-[14px] leading-5">{messages[locale].supportContactText}</Text>
        <Button
          href="https://leemonssupport.zendesk.com"
          className="py-3 px-4 mb-6 rounded text-black text-[14px] no-underline text-center border border-solid border-black"
        >
          {messages[locale].supportButtonText}
        </Button>
      </Container>
    </EmailLayout>
  );
};

const DEV_PROPS = {
  locale: 'en',
  url: 'https://k12school.leemons.dev/users/register-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imxybjpsb2NhbDp1c2Vyczpsb2NhbDo2NWM3NmZmZDQyZDQ3YjVkZGQ5NzE3YzY6VXNlcnM6NjVjNzliYTA1N2JhZWE4NzU1YWIyOTcwIiwiY29kZSI6InJzblBYUSIsImlhdCI6MTcwNzU4MDMyMCwiZXhwIjoxNzA3NjY2NzIwfQ.46OHTPJyXIGSFLHPedKWoIZnEkjRBVKp7kpVOEk6Oek',
};

const PROD_PROPS = {
  locale: 'en',
  url: '{{it.url}}',
};

Welcome.defaultProps = IS_DEV_MODE ? DEV_PROPS : PROD_PROPS;

Welcome.propTypes = {
  locale: PropTypes.string,
  url: PropTypes.string,
};

export default Welcome;
